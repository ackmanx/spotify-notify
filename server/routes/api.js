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

    const response = await fetch(endpoint.startsWith('http') ? endpoint : `https://api.spotify.com/v1${endpoint}`, options)

    if (response.statusCode === 429) {
        console.log('### Too many requests! Spotify says you need to wait:', response.headers['Retry-After'])
    }

    return response.json()
}

router.get('/new-albums/cached', ensureAuthenticated, async function (req, res) {
    const userId = req.session.user.id
    const userSeenAlbums = db.getSeenAlbums(userId)
    const cache = db.getNewAlbumsCache(userId)

    Object.keys(cache).forEach(artistId => {
        const artist = cache[artistId]
        artist.albums = artist.albums.filter(album => !userSeenAlbums.includes(album.id))
    })

    db.saveNewAlbumsCache(userId, cache)

    return res.json(cache)
})

router.get('/new-albums/refresh', ensureAuthenticated, async function (req, res) {
    const userId = req.session.user.id
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

    // const followedArtistsFromSpotify = await spotifyAPI(req, '/me/following?type=artist&limit=50')
    // followedArtistsFromSpotify.artists.items.forEach(artist =>
    //     body[artist.id] = {
    //         id: artist.id,
    //         name: artist.name,
    //     }
    // )

    const allAlbumsFollowedArtists = []

    for (let artistId in body) {
        let artistAlbumsPageOne, page2 = {}, page3 = {}, page4 = {}

        artistAlbumsPageOne = await spotifyAPI(req, `/artists/${artistId}/albums?include_groups=album,single&market=US&limit=50`)

        allAlbumsFollowedArtists.push(artistAlbumsPageOne)

        if (artistAlbumsPageOne.next) {
            page2 = await spotifyAPI(req, artistAlbumsPageOne.next)
            allAlbumsFollowedArtists.push(page2)
        }

        if (page2.next) {
            page3 = await spotifyAPI(req, page2.next)
            allAlbumsFollowedArtists.push(page3)
        }

        if (page3.next) {
            page4 = await spotifyAPI(req, page3.next)
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

    res.json(body)
})

router.post('/update-seen-albums', ensureAuthenticated, async function (req, res) {
    const seenAlbums = db.getSeenAlbums(req.session.user.id)

    db.saveSeenAlbums(req.session.user.id, seenAlbums.concat(req.body.albumIds))

    res.json({success: true})
})

module.exports = router
