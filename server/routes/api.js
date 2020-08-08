const express = require('express')
const router = express.Router()
const path = require('path')
const {fetchAllPages} = require("../service/request-helpers");
const debug = require('debug')(`sn:${path.basename(__filename)}`)

const {ensureAuthenticated} = require('./spotify-auth')
const {getUserData, saveUserData, Slices} = require('../db/dao')
const {checkForUnseenAlbums} = require('../service/spotify')
const {fetchAllPages} = require("../service/request-helpers")
const {spotifyAPI} = require('../service/request-helpers')

/*
 * Grab the user's cache from the DB so we don't pester Spotify each time we load the page (plus this is ridiculously faster)
 */
router.get('/albums/cached', ensureAuthenticated, async function (req, res) {
    const userId = req.session.user.id
    let userData

    if (process.env.MOCK) {
        userData = require('../resources/mocks/api/albums-cached-v2')
    } else {
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

router.post('/albums/add-to-playlist', ensureAuthenticated, async function (req, res) {
    const tracks = await fetchAllPages(req.session.access_token, `/albums/${req.body.albumId}/tracks`)

    //I'm going to go ahead and stupidly assume any album has less than 50 tracks so there will only be one page
    const spotifyURIsOfTracks = tracks[0].items.map(track => track.uri)

    const usersPlaylists = await fetchAllPages(req.session.access_token, '/me/playlists?limit=50')
    let iAlreadySawThat = usersPlaylists[0].items.find(playlist => playlist.name === 'I Already Saw That')

    if (!iAlreadySawThat) {
        iAlreadySawThat = await spotifyAPI(req.session.access_token, `/users/${req.session.user.id}/playlists`,
            {
                method: 'POST',
                body: JSON.stringify({name: 'I Already Saw That'})
            }
        )
    }

    iAlreadySawThat = await spotifyAPI(req.session.access_token, `/playlists/${iAlreadySawThat.id}/tracks`,
        {
            method: 'POST',
            body: JSON.stringify({uris: spotifyURIsOfTracks, position: 0})
        }
    )

    res.json(iAlreadySawThat)
})

/*
 * Pings the server so it doesn't sleep
 * This is because when the server sleeps you get logged out and will lose any albums marked as seen
 */
router.get('/heartbeat', function (req, res) {
    res.json({alive: true})
})

/*
 * Playlist sandboxing
 */
router.get('/playlist', ensureAuthenticated, async function (req, res) {
    //todo: this returns all playlists. we need to find the one we want to shuffle by getting its ID
    // const usersPlaylists = await fetchAllPages(req.session.access_token, '/me/playlists?limit=50')

    //todo: do a GET for that playlist
    const playlist = await fetchAllPages(req.session.access_token, '/playlists/7at9lCk1NMBgJQI2v24fi3/tracks?fields=next,offset,items(track(name))')

    //todo: save the response somewhere as a backup
        //todo: verify you save the fields needed to re-create the same playlist if things go south

    //todo: shuffle in memory

    //todo: PUT the same url used to GET the playlist
        //todo: the request will have query param uris that's empty, so we delete the current playlist

    //todo: after the PUT is done, we can POST the same url with the new tracks
        //todo: spotify only accepts 100 at a time, so you need to build pages to send out

    //todo: retry handling needs to work for this because otherwise we might delete the playlist without being able to recreate it shuffled

    //todo: by now we should have the backup saved and our playlist shuffled

    // res.json(usersPlaylists)
    res.json(playlist)
})

module.exports = router
