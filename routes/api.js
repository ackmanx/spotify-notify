const express = require('express')
const router = express.Router()
const fetch = require('node-fetch')
const {ensureAuthenticated} = require('./auth')


// ---------------------------------------------------------------------------------
// REST
// ---------------------------------------------------------------------------------
router.get('/get-following', ensureAuthenticated, async function (req, res) {
    const options = {
        headers: {
            Authorization: `Bearer ${req.session.access_token}`,
        }
    }

    const followedArtistsResponse = await fetch('https://api.spotify.com/v1/me/following?type=artist', options)
    const followedArtistsBody = await followedArtistsResponse.json()

    res.json(followedArtistsBody)
})

module.exports = router
