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
    return await response.json()
}

//https://developer.spotify.com/documentation/web-api/reference-beta/#endpoint-get-followed
router.get('/get-following', ensureAuthenticated, async function (req, res) {
    res.json(await spotifyAPI(req, '/me/following?type=artist&limit=50'))
})

//https://developer.spotify.com/documentation/web-api/reference-beta/#endpoint-get-an-artists-albums
router.get('/get-artist-albums', ensureAuthenticated, async function (req, res) {
    const id = req.query.artistId

    if (!id) {
        return res.json({error: 'You need to specify an artist ID'})
    }

    res.json(await spotifyAPI(req, `/artists/${id}/albums?include_groups=album,single&market=US&limit=50`))
})

router.get('/get-db-seenAlbums', ensureAuthenticated, async function (req, res) {
    res.json(db.getSeenAlbums())
})

router.get('/set-db-seenAlbums', ensureAuthenticated, async function (req, res) {
    res.json(db.saveSeenAlbums(req.session.user.id, ['7fy6Wpnn5NZllJzUXDeDpS', '2o8c58hCJJ6MT7uEQqbnt6', '7HFFEjrwzZNpbee44SJnn9']))
})

router.get('/get-db-newAlbumsCache', ensureAuthenticated, async function (req, res) {
    res.json(db.getNewAlbumsCache())
})

router.get('/set-db-newAlbumsCache', ensureAuthenticated, async function (req, res) {
    res.json(db.saveNewAlbumsCache(req.session.user.id, require('../mock/api/get-new-albums--refresh')))
})

module.exports = router
