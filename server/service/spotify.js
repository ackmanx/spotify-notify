const db = require('../db/db')
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

    const retryAfterSeconds = response.headers['retry-after']

    if (retryAfterSeconds) {
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

exports.checkForNewAlbums = async function checkForNewAlbums(session) {
    const userId = session.user.id
    const userSeenAlbums = db.getSeenAlbums(userId)

    let body = {}

    // //This mock is for getting a smaller set of followed artists than I would get making the real call below
    // //Don't forget to comment out the followedArtistsFromSpotify block
    // body = {
    //     "77AiFEVeAVj2ORpC85QVJs": {
    //         "id": "77AiFEVeAVj2ORpC85QVJs",
    //         "name": "Steve Aoki"
    //     },
    // }

    debug(`Getting followed artists for ${userId}`)

    const followedArtistsFromSpotify = await fetchAllPages(session.access_token, '/me/following?type=artist&limit=50')
    followedArtistsFromSpotify.forEach(followed =>
        followed.artists.items.forEach(artist =>
            body[artist.id] = {
                id: artist.id,
                name: artist.name,
            }
        )
    )

    debug(`Found ${Object.keys(body).length} artists`)

    const allAlbumsFollowedArtists = []

    for (let artistId in body) {
        const albums = await fetchAllPages(session.access_token, `/artists/${artistId}/albums?include_groups=album,single&market=US&limit=50`)
        //Spread albums because fetchAlbumsAllPages returns an array of responses, and we want this array to be flat
        allAlbumsFollowedArtists.push(...albums)
    }

    allAlbumsFollowedArtists.forEach(allAlbumsForSingleArtist => {
        //The albums response does not contain the artistId used for searching except in the href and artists array
        //However, being the album could be a collab, there may be multiple artists in the array and order is not predictable
        //Being we don't know the artistId used for searching in this loop, we have to pull it out of the href
        const [, artistId] = allAlbumsForSingleArtist.href.match(/artists\/(.+)\/albums/)

        let albums = body[artistId].albums
        if (!Array.isArray(albums)) albums = []

        allAlbumsForSingleArtist.items.forEach(album => {
            if (userSeenAlbums.includes(album.id)) return

            albums.push({
                id: album.id,
                name: album.name,
                coverArt: album.images[1].url, //response always has 3 images of diff sizes, and I always want the middle one
                releaseDate: album.release_date,
                type: album.album_type,
                spotifyUri: album.uri,
                spotifyWebPlayerUrl: album.external_urls.spotify,
            })
        })

        //Sort albums in descending order by their release date
        albums.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))

        body[artistId].albums = albums
    })

    db.saveNewAlbumsCache(userId, body)

    return body
}
