const express = require('express')
const router = express.Router()
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
        completed: req.session.refreshCompleted,
        total: req.session.refreshTotal,
    })
})

/*
 * Takes the list of albums in the request and saves them to the DB for the user
 * Also updates some metadata for the user
 */
router.post('/albums/update-seen', ensureAuthenticated, async function (req, res) {
    const user = await getUserData(req.session.user.id, Slices.user)

    user.lastUpdated = new Date()
    await saveUserData(user.id, Slices.user, user)

    const seenAlbums = await getUserData(user.id, Slices.seenAlbums)
    const markedAsSeen = req.body.albumIds
    await saveUserData(user.id, Slices.seenAlbums, seenAlbums.concat(markedAsSeen))

    const unseenAlbumCache = await getUserData(user.id, Slices.unseenAlbumsCache)
    unseenAlbumCache.totalUnseenAlbums -= markedAsSeen.length
    await saveUserData(user.id, Slices.unseenAlbumsCache, unseenAlbumCache)

    res.json({success: true})
})

/*
 * Pings the server so it doesn't sleep
 * This is because when the server sleeps you get logged out and will lose any albums marked as seen
 */
router.get('/heartbeat', function (req, res) {
    res.json({alive: true})
})


module.exports = router
