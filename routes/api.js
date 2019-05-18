const express = require('express')
const router = express.Router()
const fetch = require('node-fetch')
const {ensureAuthenticated} = require('./auth')

async function spotifyAPI(req, endpoint) {
    const options = {
        headers: {
            Authorization: `Bearer ${req.session.access_token}`,
        }
    }

    const response = await fetch(`https://api.spotify.com/v1${endpoint}`, options)
    return await response.json()
}

// ---------------------------------------------------------------------------------
// REST
// ---------------------------------------------------------------------------------

//https://developer.spotify.com/documentation/web-api/reference-beta/#endpoint-get-followed
router.get('/get-following', ensureAuthenticated, async function (req, res) {
    res.json(await spotifyAPI(req, '/me/following?type=artist&limit=50'))
})

//https://developer.spotify.com/documentation/web-api/reference-beta/#endpoint-get-an-artists-albums
router.get('/get-artist-albums', ensureAuthenticated, async function (req, res) {
    const id = req.query.artistId

    if (!id) {
        return res.json({error: 'You need to specify an artist ID'})
    }

    res.json(await spotifyAPI(req, `/artists/${id}/albums?include_groups=album,single&market=US&limit=50`))
})

router.get('/get-new-albums', ensureAuthenticated, async function (req, res) {
    // const followedArtistsAPIResponse = await spotifyAPI(req, '/me/following?type=artist&limit=50')
    // const followedArtistsIDs = followedArtistsAPIResponse.artists.items.map(artist => artist.id)
    const followedArtistsIDs = ['03SZv6slUnLnHI3IfwG0gl', '053q0ukIDRgzwTr4vNSwab', '07ZhipyrvoyNoJejeyM0PQ']

    const allAlbumsPromises = []

    followedArtistsIDs.forEach(artistId =>
        allAlbumsPromises.push(spotifyAPI(req, `/artists/${artistId}/albums?include_groups=album,single&market=US&limit=50`))
    )

    let body

    try {
        body = await Promise.all(allAlbumsPromises)
    }
    catch (error) {
        body = {error}
    }

    res.json(body)

})

module.exports = router
