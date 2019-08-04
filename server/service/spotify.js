const db = require('../db/db')
const fetch = require('node-fetch')

async function spotifyAPI(accessToken, endpoint) {
    const options = {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        }
    }

    const response = await fetch(endpoint.startsWith('http') ? endpoint : `https://api.spotify.com/v1${endpoint}`, options)

    if (response.statusCode === 429) {
        console.log('### Too many requests! Spotify says you need to wait:', response.headers['Retry-After'])
    }

    return response.json()
}

async function fetchAlbumsAllPages(accessToken, artistId) {
    const albums = []

    let albumsResponse = await spotifyAPI(accessToken, `/artists/${artistId}/albums?include_groups=album,single&market=US&limit=50`)
    let hasNext = albumsResponse.next

    albums.push(albumsResponse)

    while (hasNext) {
        albumsResponse = await spotifyAPI(accessToken, albumsResponse.next)
        hasNext = albumsResponse.next
        albums.push(albumsResponse)
    }

    return albums
}

exports.checkForNewAlbums = async function checkForNewAlbums(session) {
    const userId = session.user.id
    const userSeenAlbums = db.getSeenAlbums(userId)

    let body = {}

    //todo: Steve Aoki has more than 50 results for albums, so use him for paging
    //This mock is for getting a smaller set of followed artists than I would get making the real call below
    body = {
        "77AiFEVeAVj2ORpC85QVJs": {
            "id": "77AiFEVeAVj2ORpC85QVJs",
            "name": "Steve Aoki"
        },
    }

    // const followedArtistsFromSpotify = await spotifyAPI(session.access_token, '/me/following?type=artist&limit=50')
    // followedArtistsFromSpotify.artists.items.forEach(artist =>
    //     body[artist.id] = {
    //         id: artist.id,
    //         name: artist.name,
    //     }
    // )

    const allAlbumsFollowedArtists = []

    for (let artistId in body) {
        const albums = await fetchAlbumsAllPages(session.access_token, artistId)
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
            })
        })

        //Sort albums in descending order by their release date
        albums.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))

        body[artistId].albums = albums
    })

    db.saveNewAlbumsCache(userId, body)

    return body
}
