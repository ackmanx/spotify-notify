const express = require('express')
const router = express.Router()
const path = require('path')
const delay = require('delay')
const { fetchAllPages } = require('../service/request-helpers')
const { ensureAuthenticated } = require('./spotify-auth')
const debug = require('debug')(`sn:${path.basename(__filename)}`)

/*
 * ------------------------------------------------------------------------------------------------------------------------------------------
 * Shuffle a playlist
 * I want to be able to pass a playlist to the shuffler and have it return the new playlist, which will then be send to Spotify
 * ------------------------------------------------------------------------------------------------------------------------------------------
 */
function shuffle(playlist) {
    /*
     * Generate flat list of tracks
     */
    let tracks = []

    playlist.forEach((playlistPage) => {
        tracks = tracks.concat(playlistPage.items.map((item) => item.track.uri))
    })

    /*
     * Now we have a flat array of the tracks, we can shuffle it
     * Let's sort this so we can more easily see progress while developing
     */
    tracks.sort()

    /*
     * Shuffle
     * Go through each element
     * Get a random new index number
     * Swap
     */
    for (let i = 0; i < tracks.length; i++) {
        const newIndex = Math.round(Math.random() * tracks.length)

        const trackBeingReplaced = tracks[newIndex]
        tracks[newIndex] = tracks[i]
        tracks[i] = trackBeingReplaced

        debug('new:', tracks[newIndex], 'old:', tracks[i])
    }

    return tracks
}

/*
 * All operations are on the same endpoint, just different HTTP methods
 *
 * First you get the playlist's tracks
 * https://developer.spotify.com/documentation/web-api/reference/playlists/get-playlists-tracks/
 *
 * After shuffling you have to clear the playlist
 * https://developer.spotify.com/documentation/web-api/reference/playlists/replace-playlists-tracks/
 *
 * Then you add tracks in pages to rebuild it
 * https://developer.spotify.com/documentation/web-api/reference/playlists/add-tracks-to-playlist/
 */
router.get('/shuffle-playlist', ensureAuthenticated, async function (req, res) {
    //Get my Club music playlist
    const playlist = await fetchAllPages(
        req.session.access_token,
        '/playlists/7at9lCk1NMBgJQI2v24fi3/tracks?fields=next,offset,items(track(uri))'
    )

    //todo: save the response somewhere as a backup
    //todo: verify you save the fields needed to re-create the same playlist if things go south

    //todo: it happened once where I got some nulls in here but don't know how
    //todo: maybe need to do a check for nulls and a check for length of before/after?
    const shuffled = shuffle(playlist)

    //todo: PUT the same url used to GET the playlist to delete it
    //todo: the request will have query param uris that's empty, so we delete the current playlist

    //todo: after the PUT is done, we can POST the same url with the new tracks
    //todo: spotify only accepts 100 at a time, so you need to build pages to send out

    //todo: retry handling needs to work for this because otherwise we might delete the playlist without being able to recreate it shuffled

    //todo: by now we should have the backup saved and our playlist shuffled

    res.json({ uris: shuffled })
})
/*
 * ------------------------------------------------------------------------------------------------------------------------------------------
 * END
 * ------------------------------------------------------------------------------------------------------------------------------------------
 */

module.exports = router
