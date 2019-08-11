const db = require('../db/db')
const fetch = require('node-fetch')

async function spotifyAPI(accessToken, endpoint) {
    const options = {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        }
    }

    const response = await fetch(endpoint.startsWith('http') ? endpoint : `https://api.spotify.com/v1${endpoint}`, options)

    if (response.status >= 400) {
        console.log(`### Yikes! There was an error. Here's some headers for this call:`, endpoint, response.headers)
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

    const followedArtistsFromSpotify = await fetchAllPages(session.access_token, '/me/following?type=artist&limit=50')
    followedArtistsFromSpotify.forEach(followed =>
        followed.artists.items.forEach(artist =>
            body[artist.id] = {
                id: artist.id,
                name: artist.name,
            }
        )
    )

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
                url: album.external_urls.spotify,
                coverArt: album.images[1].url, //response always has 3 images of diff sizes, and I always want the middle one
                releaseDate: album.release_date,
                type: album.album_type,
            })
        })

        //Sort albums in descending order by their release date
        albums.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))

        body[artistId].albums = albums
    })

    db.saveNewAlbumsCache(userId, body)

    return body
}
