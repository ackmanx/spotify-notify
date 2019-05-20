const express = require('express')
const router = express.Router()

// ---------------------------------------------------------------------------------
// Page renders
// ---------------------------------------------------------------------------------
router.get('/', function (req, res) {
    let loggedIn = false

    if (req.session.access_token) {
        loggedIn = true
    }

    res.render('index', {title: 'Spotify Notify', loggedIn})
})

module.exports = router
