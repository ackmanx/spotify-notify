const express = require('express');
const router = express.Router();

/*
 * Spotify Developer Dashboard
 * https://developer.spotify.com/dashboard/applications/e466e7a286954e13b501d8e7bc4669cc
 */

const clientID = 'e466e7a286954e13b501d8e7bc4669cc';
const clientSecret = '76f2fd5049574e09899dcf84810e5fef'; //this will live in heroku config so it isn't exposed via git, but until then store it here and regen a new key later
const callbackURL = 'http://localhost:3000/auth/callback'; //where to be sent by spotify after logging in. this must be whitelisted in spotify developer dashboard first

// ---------------------------------------------------------------------------------
// REST
// ---------------------------------------------------------------------------------
router.get('/login', function (req, res) {
    res.json({})
});

router.get('/callback', function success(req, res) {
    res.redirect('/');
});

module.exports = router;
