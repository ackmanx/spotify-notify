const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')
const debug = require('debug')(`sn:${path.basename(__filename)}`)

const {ensureAuthenticated} = require('./spotify-auth')
const {getUserData, saveUserData, Slices} = require('../db/dao')
const {checkForUnseenAlbums} = require('../service/spotify')

/*
 * Grab the user's cache from the DB so we don't pester Spotify each time we load the page (plus this is ridiculously faster)
 */
router.get('/albums/cached', ensureAuthenticated, async function (req, res) {
    const userId = req.session.user.id
    let userData

    if (process.env.MOCK) {
        userData = require('../resources/mocks/api/albums-cached-v2')
    }
    else {
        userData = await getUserData(userId)
    }

    //If a user's never been here, they won't have had this fetched from Spotify yet
    if (!userData.user.totalFollowedArtists) {
        return res.json({firstTimeUser: true})
    }

    //Go through each artist in the cache and filter out seen albums
    //We don't cache seen albums, but the cache isn't rebuilt until the user does a refresh
    //So, this is to hide them until a refresh
    Object.entries(userData.unseenAlbumsCache.artists).forEach(([, artist]) => {
        artist.albums = artist.albums.filter(album => !userData.seenAlbums.includes(album.id))

        if (!artist.albums.length) delete userData.unseenAlbumsCache.artists[artist.id]
    })

    return res.json({...userData.unseenAlbumsCache, ...userData.user})
})

/*
 * Query Spotify to refresh the cache
 * This will get all followed artists, then all their albums
 * Lastly it will remove the albums we've seen and save the cache to the DB before sending it to the user
 */
router.get('/albums/refresh', ensureAuthenticated, async function (req, res) {
    res.json(await checkForUnseenAlbums(req.session))
})

/*
 * Get the current status for Spotify albums refresh
 * The session is updated in `checkForUnseenAlbums` as progress is made and the UI will poll this endpoint on an interval
 */
router.get('/albums/refresh-status', ensureAuthenticated, async function (req, res) {
    res.json({
        current: req.session.refreshCurrent,
        total: req.session.refreshTotal,
        error: req.session.refreshError,
    })
})

router.post('/seen-albums/update', ensureAuthenticated, async function (req, res) {
    const userId = req.session.user.id
    const markedAsSeen = req.body.albumIds
    const userSeenAlbums = await getUserData(userId, Slices.seenAlbums)
    const unseenAlbumCache = await getUserData(userId, Slices.unseenAlbumsCache)

    unseenAlbumCache.totalUnseenAlbums -= markedAsSeen.length

    await saveUserData(userId, Slices.seenAlbums, userSeenAlbums.concat(markedAsSeen))
    await saveUserData(userId, Slices.unseenAlbumsCache, unseenAlbumCache)

    res.json({success: true})
})

module.exports = router
