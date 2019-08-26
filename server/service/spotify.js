const dao = require('../db/dao')
const fetch = require('node-fetch')
const path = require('path')
const debug = require('debug')(`sn:${path.basename(__filename)}`)

function sleep(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000))
}

async function spotifyAPI(accessToken, endpoint) {
    const options = {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        }
    }

    const spotifyApiURL = endpoint.startsWith('http') ? endpoint : `https://api.spotify.com/v1${endpoint}`

    let response = await fetch(spotifyApiURL, options)

    if (response.status === 429) {
        const retryAfterSeconds = response.headers.get('retry-after') //for some reason `get` is the official way to return headers

        debug(`Throttled by Spotify, retrying ${spotifyApiURL} after ${retryAfterSeconds} seconds`)

        await sleep(retryAfterSeconds)
        response = await fetch(spotifyApiURL, options)
    }

    return response.json()
}

function getPagingNextUrl(response) {
    if (response.next) return response.next

    if (response.artists && response.artists.next) return response.artists.next
}

//Spotify puts the paging object in different places for their APIs, so we have to check multiple locations for `next`
async function fetchAllPages(accessToken, relativeSpotifyUrl) {
    const results = []

    let response = await spotifyAPI(accessToken, relativeSpotifyUrl)
    let nextPageAbsoluteUrl = getPagingNextUrl(response)

    results.push(response)

    while (nextPageAbsoluteUrl) {
        response = await spotifyAPI(accessToken, nextPageAbsoluteUrl)
        nextPageAbsoluteUrl = getPagingNextUrl(response)
        results.push(response)
    }

    return results
}

/*
 * This transforms a single artist's albums responses from Spotify into the contract for the cache
 * Note that Spotify refers to "album albums" and "album singles", whereas I'm using the terminology "release album" and "release single"
 */
async function transformSpotifyReleasesToCache(pagesOfArtistsAndTheirReleases, newCache, userId) {
    const userSeenAlbums = await dao.getSeenAlbums(userId)

    //`pagesOfArtistsAndTheirReleases` is all artists and all their releases, but in pages if they have over 50 releases
    pagesOfArtistsAndTheirReleases.forEach(singlePageOfArtistAndReleases => {
        //The albums response from Spotify does not contain the artistId used for searching except in the href and artists array
        //However, being the album could be a collab, there may be multiple artists in the array and order is not predictable
        //Being we don't know the artistId used for searching in this loop, we have to pull it out of the href
        const [, artistId] = singlePageOfArtistAndReleases.href.match(/artists\/(.+)\/albums/)

        let releases = newCache[artistId].albums //todo: change to releases and update UI
        if (!Array.isArray(releases)) releases = []

        singlePageOfArtistAndReleases.items.forEach(release => {
            if (userSeenAlbums.includes(release.id)) return

            releases.push({
                id: release.id,
                name: release.name,
                coverArt: release.images[1].url, //response always has 3 images of diff sizes, and I always want the middle one
                releaseDate: release.release_date,
                type: release.album_type,
                spotifyUri: release.uri,
                spotifyWebPlayerUrl: release.external_urls.spotify,
            })
        })

        //Sort releases in descending order by their release date
        releases.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))

        newCache[artistId].albums = releases
    })
}

exports.checkForNewReleases = async function checkForNewReleases(session) {
    const userId = session.user.id

    let newCache = {}

    debug(`Getting followed artists for ${userId}`)

    //This mock is for getting a smaller set of followed artists than I would get making the real call below
    const followedArtistsPagesFromSpotify = [require('../resources/mocks/spotify/v1-me-following')]
    // const followedArtistsPagesFromSpotify = await fetchAllPages(session.access_token, '/me/following?type=artist&limit=50')
    
    const totalFollowedArtists = followedArtistsPagesFromSpotify[0].total
    debug(`Found ${totalFollowedArtists} artists`)

    followedArtistsPagesFromSpotify.forEach(followedPage =>
        followedPage.artists.items.forEach(artist =>
            newCache[artist.id] = {
                id: artist.id,
                name: artist.name,
            }
        )
    )

    const allAlbumsPagesOfFollowedArtists = []

    for (let artistId in newCache) {
        const albumsPages = await fetchAllPages(session.access_token, `/artists/${artistId}/albums?include_groups=album,single&market=US&limit=50`)
        //Spread albums because fetchAlbumsAllPages returns an array of responses, and we want this array to be flat of all artists and albums
        allAlbumsPagesOfFollowedArtists.push(...albumsPages)
    }

    await transformSpotifyReleasesToCache(allAlbumsPagesOfFollowedArtists, newCache, userId)

    await dao.saveNewAlbumsCache(userId, newCache)

    return newCache
}
