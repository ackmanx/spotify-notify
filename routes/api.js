const express = require('express')
const router = express.Router()
const fetch = require('node-fetch')


// ---------------------------------------------------------------------------------
// REST
// ---------------------------------------------------------------------------------
router.get('/new-albums', async function (req, res) {
    const options = {
        headers: {
            Authorization: `Bearer ${req.session.accessToken}`,
        }
    }

    const followedArtistsResponse = await fetch('https://api.spotify.com/v1/me/following', options)
    const followedArtistsBody = await followedArtistsResponse.json()

    res.json(followedArtistsBody)
})

module.exports = router
