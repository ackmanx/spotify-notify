const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')
const debug = require('debug')(`sn:${path.basename(__filename)}`)

const {ensureAuthenticated} = require('./auth')
const dao = require('../db/dao')
const {checkForNewAlbums} = require('../service/spotify')

/*
 * Grab the user's cache from the DB so we don't pester Spotify each time we load the page (plus this is ridiculously faster)
 */
router.get('/albums/cached', ensureAuthenticated, async function (req, res) {
    const userId = req.session.user.id
    const userSeenAlbums = await dao.getSeenAlbums(userId)
    const cache = await dao.getNewAlbumsCache(userId)

    //Go through each artist in the cache and filter out seen albums
    //We don't cache seen albums, but the cache isn't rebuilt until the user does a refresh
    //So, this is to hide them until a refresh
    Object.entries(cache.artists || []).forEach(([, artist]) => {
        artist.albums = artist.albums.filter(album => !userSeenAlbums.includes(album.id))
    })

    return res.json(cache)
})

/*
 * Query Spotify to refresh the cache
 * This will get all followed artists, then all their albums
 * Lastly it will remove the albums we've seen and save the cache to the DB before sending it to the user
 */
router.get('/albums/refresh', ensureAuthenticated, async function (req, res) {
    res.json(await checkForNewAlbums(req.session))
})

router.post('/seen-albums/update', ensureAuthenticated, async function (req, res) {
    const userId = req.session.user.id
    const userSeenAlbums = await dao.getSeenAlbums(userId)

    await dao.saveSeenAlbums(userId, userSeenAlbums.concat(req.body.albumIds))

    res.json({success: true})
})

router.get('/dump', ensureAuthenticated, async function (req, res) {
    debug('Performing whole database dump')
    res.json(await dao.dump())
})

module.exports = router
