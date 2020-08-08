const path = require('path')
const debug = require('debug')(`sn:${path.basename(__filename)}`)

exports.shuffle = function shuffle(playlist) {
    /*
     * Generate flat list of tracks
     */
    let tracks = []

    playlist.forEach(playlistPage => {
        tracks = tracks.concat(playlistPage.items.map(item => item.track.uri))
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
