const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')
const debug = require('debug')(`sn:${path.basename(__filename)}`)

const {ensureAuthenticated} = require('./spotify-auth')
const {getUserData, saveUserData, Slices} = require('../db/dao')
const {checkForNewAlbums} = require('../service/spotify')

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
    Object.entries(userData.newAlbumsCache.artists).forEach(([, artist]) => {
        artist.albums = artist.albums.filter(album => !userData.seenAlbums.includes(album.id))
    })

    //todo: UI needs to be updated so these aren't mixed together
    return res.json({...userData.newAlbumsCache, ...userData.user})
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
    const markedAsSeen = req.body.albumIds
    const userSeenAlbums = await getUserData(userId, Slices.seenAlbums)
    const newAlbumCache = await getUserData(userId, Slices.newAlbumsCache)

    newAlbumCache.totalNewAlbums -= markedAsSeen.length

    await saveUserData(userId, Slices.seenAlbums, userSeenAlbums.concat(markedAsSeen))
    await saveUserData(userId, Slices.newAlbumsCache, newAlbumCache)

    res.json({success: true})
})

module.exports = router
