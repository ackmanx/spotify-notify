const express = require('express');
const router = express.Router();
const passport = require('passport')
const SpotifyStrategy = require('passport-spotify').Strategy

/*
 * Spotify Developer Dashboard
 * https://developer.spotify.com/dashboard/applications/e466e7a286954e13b501d8e7bc4669cc
 */

const clientID = 'e466e7a286954e13b501d8e7bc4669cc';
const clientSecret = '76f2fd5049574e09899dcf84810e5fef'; //this will live in heroku config so it isn't exposed via git, but until then store it here and regen a new key later
const callbackURL = 'http://localhost:3000/auth/callback'; //where to be sent by spotify after logging in. this must be whitelisted in spotify developer dashboard first

passport.use(
    new SpotifyStrategy(
        {
            clientID,
            clientSecret,
            callbackURL,
        },
        function (accessToken, refreshToken, expires_in, profile, done) {
            process.nextTick(() => done(null, profile));
        }
    )
);

// ---------------------------------------------------------------------------------
// REST
// ---------------------------------------------------------------------------------
const strategy = 'spotify'

router.get('/login', passport.authenticate(strategy, {
    scope: ['user-follow-modify'],
    showDialog: false
}), function () {
    //Spotify redirects the request, so this handler will never be called
});

router.get('/callback', passport.authenticate(strategy, {failureRedirect: '/#loginFailed'}),
    function success(req, res) {
        req.session.accessToken = req.query.code
        res.redirect('/');
    }
);

module.exports = router;
