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

    res.render('index', { title: 'I Already Saw That', loggedIn })
})

module.exports = router
