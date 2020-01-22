/*
 * Go here: https://developer.spotify.com/console/get-artist-albums/?id=7aMQdNM05rPkcHS1ethHUx&include_groups=album,single&market=US&limit=50&offset=
 * Get sample data for the artist's albums you want (you need the artist ID first)
 * Paste the entire response from Spotify below
 * Run this file
 * Outputted with be the albums-cached-v2 format
 */

const spotifyResponse = {}

console.log(spotifyResponse.items.map(album => ({
        id: album.id,
        name: album.name,
        artistName: album.artists[0].name,
        coverArt: album.images[1].url,
        releaseDate: album.release_date,
        type: album.type,
        spotifyUri: album.uri,
        spotifyWebPlayerUrl: album.artists[0].external_urls.spotify,
    }))
)
