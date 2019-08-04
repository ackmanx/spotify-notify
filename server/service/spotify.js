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
        let artistAlbumsPageOne, page2 = {}, page3 = {}, page4 = {}

        //todo: left off here
        //todo: can make a function that takes the response, adds it, then checks for a next. set a flag then iterate until done
        //todo: or, have recurisve function that keeps calling itself when there's a next, passing an accumulator
        artistAlbumsPageOne = await spotifyAPI(session.access_token, `/artists/${artistId}/albums?include_groups=album,single&market=US&limit=50`)

        allAlbumsFollowedArtists.push(artistAlbumsPageOne)

        if (artistAlbumsPageOne.next) {
            page2 = await spotifyAPI(session.access_token, artistAlbumsPageOne.next)
            allAlbumsFollowedArtists.push(page2)
        }

        if (page2.next) {
            page3 = await spotifyAPI(session.access_token, page2.next)
            allAlbumsFollowedArtists.push(page3)
        }

        if (page3.next) {
            page4 = await spotifyAPI(session.access_token, page3.next)
            allAlbumsFollowedArtists.push(page4)
        }
    }

    allAlbumsFollowedArtists.forEach(allAlbumsForSingleArtist => {
        //Pull out the artistId from the album URL, being I sort albums by artist
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
            })
        })

        body[artistId].albums = albums
    })

    db.saveNewAlbumsCache(userId, body)

    return body
}
