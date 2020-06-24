const debug = require('debug')(`sn:${path.basename(__filename)}`)

exports.shuffle = function shuffle(playlist) {
    /*
 * Generate flat list of names
 */
    let names = []

    playlist.forEach(playlistPage => {
        names = names.concat(playlistPage.items.map(item => item.track.name))
    })

    /*
     * Now we have a flat array of the names, we can shuffle it
     * Let's sort this so we can more easily see progress while developing
     */
    names.sort()

    /*
     * Shuffle
     * Go through each element
     * Get a random new index number
     * Swap
     *
     */
    for (let i = 0; i < names.length; i++) {
        const newIndex = Math.round(Math.random() * names.length)

        const elementBeingSwapped = names[newIndex]
        names[newIndex] = names[i]
        names[i] = elementBeingSwapped
    }

}
