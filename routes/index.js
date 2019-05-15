const express = require('express');
const router = express.Router();

// ---------------------------------------------------------------------------------
// Page renders
// ---------------------------------------------------------------------------------
router.get('/', function (req, res) {
    let loggedIn = false
    let loggedInMessage = "Dude, you've gotta log into Spotify first";

    if (req.session.accessToken) {
        loggedIn = true
        loggedInMessage = "You've totally got access"
    }

    res.render('index', { title: 'Spotify Notify', loggedInMessage, loggedIn });
});

module.exports = router;
