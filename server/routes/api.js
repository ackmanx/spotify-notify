const express = require('express')
const router = express.Router()
const fetch = require('node-fetch')
const {ensureAuthenticated} = require('./auth')
const db = require('../db/db')

async function spotifyAPI(req, endpoint) {
    const options = {
        headers: {
            Authorization: `Bearer ${req.session.access_token}`,
        }
    }

    const response = await fetch(`https://api.spotify.com/v1${endpoint}`, options)

    if (response.statusCode === 429) {
        console.log('### Too many requests! Spotify says you need to wait:', response.headers['Retry-After'])
    }

    return await response.json()
}

router.get('/get-new-albums', ensureAuthenticated, async function (req, res) {
    const userId = req.session.user.id

    if (req.query.refresh !== 'true') {
        return res.json(getNewAlbumCache(userId))
    }

    let body = {}
    const userSeenAlbums = db.getSeenAlbums(userId)


    //This mock is for getting a smaller set of followed artists than I would get making the real call below
    body = {
        "0UF7XLthtbSF2Eur7559oV": {
            "id": "0UF7XLthtbSF2Eur7559oV",
            "name": "Kavinsky"
        },
        "0lP5aPV834goEtT6asKAek": {
            "id": "0lP5aPV834goEtT6asKAek",
            "name": "Das Bo"
        },
    }

    // const followedArtistsFromSpotify = await spotifyAPI(req, '/me/following?type=artist&limit=50')
    // followedArtistsFromSpotify.artists.items.forEach(artist =>
    //     body[artist.id] = {
    //         id: artist.id,
    //         name: artist.name,
    //     }
    // )

    const allAlbumsPromises = []

    for (let artistId in body) {
        allAlbumsPromises.push(spotifyAPI(req, `/artists/${artistId}/albums?include_groups=album,single&market=US&limit=50`))
    }

    const allAlbumsFollowedArtists = await Promise.all(allAlbumsPromises)

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

    res.json(body)
})

function getNewAlbumCache(userId) {
    return db.getNewAlbumsCache(userId)
}

module.exports = router
