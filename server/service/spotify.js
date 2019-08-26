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
 * This transforms lists of artists' albums responses from Spotify into the contract for the cache
 * This operates on all the artists and their albums, not just a single artist's albums
 * Note that this is an array of API response pages, so there may be several pages for a single artist if they have a lot of albums
 */
async function transformSpotifyArtistAlbumPagesToCache(pagesOfArtistAlbums, newCache, userId) {
    const userSeenAlbums = await dao.getSeenAlbums(userId)

    pagesOfArtistAlbums.forEach(artistAlbumPage => {
        //The albums response from Spotify does not contain the artistId used for searching except in the href and artists array
        //However, being the album could be a collab, there may be multiple artists in the array and order is not predictable
        //Being we don't know the artistId used for searching in this loop, we have to pull it out of the href
        const [, artistId] = artistAlbumPage.href.match(/artists\/(.+)\/albums/)

        let allAlbumsForAnArtist = newCache[artistId].albums || []

        //Build the cache for each album in this artist page
        artistAlbumPage.items.forEach(album => {
            if (userSeenAlbums.includes(album.id)) return

            allAlbumsForAnArtist.push({
                id: album.id,
                name: album.name,
                coverArt: album.images[1].url, //response always has 3 images of diff sizes, and I always want the middle one
                releaseDate: album.release_date,
                type: album.album_type,
                spotifyUri: album.uri,
                spotifyWebPlayerUrl: album.external_urls.spotify,
            })
        })

        newCache[artistId].albums = allAlbumsForAnArtist
    })

    Object.entries(newCache).forEach(([artistId, artist]) => {
        //Remove artists from cache if all of their albums have been seen
        if (!artist.albums.length) {
            delete newCache[artistId]
            return
        }

        //Sort albums in descending order by their release date
        artist.albums.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))
    })
}

exports.checkForNewAlbums = async function checkForNewAlbums(session) {
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

    await transformSpotifyArtistAlbumPagesToCache(allAlbumsPagesOfFollowedArtists, newCache, userId)

    await dao.saveNewAlbumsCache(userId, newCache)

    return newCache
}
