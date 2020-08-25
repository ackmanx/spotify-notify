const express = require('express')
const router = express.Router()
const path = require('path')
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
    const newSeenAlbumsList = seenAlbums.concat(markedAsSeen)
    await saveUserData(user.id, Slices.seenAlbums, newSeenAlbumsList)

    const unseenAlbumsCache = await getUserData(user.id, Slices.unseenAlbumsCache)
    unseenAlbumsCache.totalUnseenAlbums -= markedAsSeen.length

    newSeenAlbumsList.forEach(albumId => {
        let isFinished = false

        Object.keys(unseenAlbumsCache.artists).forEach(artistId => {
            if (isFinished) return

            const artist = unseenAlbumsCache.artists[artistId]
            const albumIndexInCache = artist.albums.findIndex(album => albumId === album.id)

            if (albumIndexInCache > -1) {
                artist.albums.splice(albumIndexInCache, 1)
                isFinished = true
            }
        })
    })

    await saveUserData(user.id, Slices.unseenAlbumsCache, unseenAlbumsCache)

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

router.get('/playlists/search', ensureAuthenticated, async function (req, res) {
    const userId = req.session.user.id

    const searchCache = await getUserData(userId, Slices.search)
    const usersPlaylistPages = await fetchAllPages(req.session.access_token, '/me/playlists?limit=50')

    const promises = []
    const responseBody = []

    //Loop through each page of playlists, being Spotify only returns 50 playlists per request
    usersPlaylistPages.forEach(page => {
        page.items.forEach(async playlist => {
            const cachedPlaylist = searchCache.find(cachedPlaylist => cachedPlaylist.playlistName === playlist.name) || {}

            if (cachedPlaylist.snapshotId === playlist.snapshot_id) {
                debug(`Skipping new fetch for "${playlist.name}" because snapshot IDs match`)
                responseBody.push(cachedPlaylist)
                return
            }

            debug(`Fetching latest for "${playlist.name}" because snapshot IDs don't match`)

            const responsePlaylist = {
                snapshotId: playlist.snapshot_id,
                playlistName: playlist.name,
            }

            //Execution finishes this loop before responses from Spotify come back, so build up promises for each playlist so we can delay sending our response until we're ready
            const promise = new Promise(async (resolve) => {
                const tracksHref = `${playlist.tracks.href}?fields=next,items(track(name,album(name)))`
                const playlistTracksPages = await fetchAllPages(req.session.access_token, tracksHref)

                //Combine all pages of responses and transform to get one list of simple track objects
                const tracks = []
                playlistTracksPages.forEach(tracksPage => tracks.push(...tracksPage.items))

                responsePlaylist.tracks = tracks.map(({track}) => ({
                    title: track.name,
                    album: track.album.name,
                }))

                responseBody.push(responsePlaylist)

                resolve()
            });

            promises.push(promise)
        })
    })

    await Promise.all(promises)
    await saveUserData(userId, Slices.search, responseBody)

    res.json(responseBody)
})

/*
 * Pings the server so it doesn't sleep
 * This is because when the server sleeps you get logged out and will lose any albums marked as seen
 */
router.get('/heartbeat', function (req, res) {
    res.json(require('../../package.json').version)
})


module.exports = router
