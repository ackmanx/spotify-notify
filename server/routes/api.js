const express = require('express')
const router = express.Router()
const fs = require('fs')
const {promisify} = require('util')
const readFile = promisify(fs.readFile)

const {ensureAuthenticated} = require('./auth')
const db = require('../db/db')
const {checkForNewAlbums} = require('../service/spotify')

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
    res.json(await checkForNewAlbums(req.session))
})

router.post('/update-seen-albums', ensureAuthenticated, async function (req, res) {
    const seenAlbums = db.getSeenAlbums(req.session.user.id)

    db.saveSeenAlbums(req.session.user.id, seenAlbums.concat(req.body.albumIds))

    res.json({success: true})
})

router.get('/dump', async function (req, res) {
    const dump = await readFile('server/db/database.json', {encoding: 'utf8'})
    res.json(JSON.parse(dump))
})

module.exports = router
