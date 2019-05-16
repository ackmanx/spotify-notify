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
router.get('/get-following', ensureAuthenticated, async function (req, res) {
    res.json(await spotifyAPI(req, '/me/following?type=artist'))
})

router.get('/mock/get-following', function (req, res) {
    res.json(require('../mock/v1-me-following'))
})

module.exports = router
