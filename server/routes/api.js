const express = require('express')
const router = express.Router()
const fs = require('fs')
const {promisify} = require('util')
const path = require('path')
const debug = require('debug')(`sn:${path.basename(__filename)}`)

const {ensureAuthenticated} = require('./auth')
const dao = require('../db/dao')
const {checkForNewAlbums} = require('../service/spotify')

router.get('/new-albums/cached', ensureAuthenticated, async function (req, res) {
    const userId = req.session.user.id
    const userSeenAlbums = await dao.getSeenAlbums(userId)
    const cache = await dao.getNewAlbumsCache(userId)

    Object.keys(cache).forEach(artistId => {
        const artist = cache[artistId]
        artist.albums = artist.albums.filter(album => !userSeenAlbums.includes(album.id))
    })

    return res.json(cache)
})

router.get('/new-albums/refresh', ensureAuthenticated, async function (req, res) {
    res.json(await checkForNewAlbums(req.session))
})

router.post('/update-seen-albums', ensureAuthenticated, async function (req, res) {
    const seenAlbums = dao.getSeenAlbums(req.session.user.id)

    dao.saveSeenAlbums(req.session.user.id, seenAlbums.concat(req.body.albumIds))

    res.json({success: true})
})

router.get('/dump', ensureAuthenticated, async function (req, res) {
    debug('Performing whole database dump')
    res.json(await dao.dump())
})

module.exports = router
