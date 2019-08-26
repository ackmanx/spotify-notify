const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')
const debug = require('debug')(`sn:${path.basename(__filename)}`)

const {ensureAuthenticated} = require('./auth')
const dao = require('../db/dao')
const {checkForNewReleases} = require('../service/spotify')

/*
 * Grab the user's cache from the DB so we don't pester Spotify each time we load the page (plus this is ridiculously faster)
 */
router.get('/releases/cached', ensureAuthenticated, async function (req, res) {
    const userId = req.session.user.id
    const userSeenAlbums = await dao.getSeenAlbums(userId)
    const cache = await dao.getNewAlbumsCache(userId)

    //Go through each artist in the cache and filter out seen releases
    //We don't cache seen releases, but the cache isn't rebuilt until the user does a refresh
    //So, this is to hide them until a refresh
    Object.keys(cache).forEach(artistId => {
        const artist = cache[artistId]
        artist.albums = artist.albums.filter(album => !userSeenAlbums.includes(album.id))
    })

    return res.json(cache)
})

/*
 * Query Spotify to refresh the cache
 * This will get all followed artists, then all their releases
 * Lastly it will remove the releases we've seen and save the cache to the DB before sending it to the user
 */
router.get('/releases/refresh', ensureAuthenticated, async function (req, res) {
    res.json(await checkForNewReleases(req.session))
})

router.post('/seen-releases/update', ensureAuthenticated, async function (req, res) {
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
