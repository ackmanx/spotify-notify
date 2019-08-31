const express = require('express')
const router = express.Router()
const querystring = require('querystring')
const request = require('request')
const fetch = require('node-fetch')
const dao = require('../db/dao')

/*
 * # Authorization is a multi-step process
 * 1) From the browser, user goes to /login
 * 2) Code here sends a request to Spotify's /authorize
 * 3) On success, Spotify's /authorize will send the user go our whitelisted redirect_uri here, /callback

 * # At this point we have we've authorized but don't have a token to make API requests
 * 4) We make a call to Spotify's /api/token to get an access_token
 * 5) Spotify returns an access_token and refresh_token (for when the access_token expires)
 *
 * # Now we have a token to make protected API request to Spotify
 */

/*
 * Spotify Developer Dashboard
 * https://developer.spotify.com/dashboard/applications/e466e7a286954e13b501d8e7bc4669cc
 */

const client_id = 'e466e7a286954e13b501d8e7bc4669cc' //this is the ID for my application registered with Spotify
const client_secret = '76f2fd5049574e09899dcf84810e5fef' //this will live in heroku config so it isn't exposed via git, but until then store it here and regen a new key later
const scope = 'user-follow-read'
const stateKey = 'spotify_auth_state'

let redirect_uri //where to be sent by spotify after logging in. this must be whitelisted in spotify developer dashboard first

if (process.env.NODE_ENV === 'production') {
    redirect_uri = 'http://www.ialreadysawthat.com/auth/callback'
}
else {
    redirect_uri = 'http://me:3666/auth/callback'
}

// ---------------------------------------------------------------------------------
// REST
// ---------------------------------------------------------------------------------
router.get('/login', function (req, res) {
    const state = Math.random()
    res.cookie(stateKey, state)

    const queryString = querystring.stringify({
        response_type: 'code',
        client_id,
        scope,
        redirect_uri,
        state,
    })

    res.redirect(`https://accounts.spotify.com/authorize?${queryString}`)
})

router.get('/callback', function (req, res) {
    const code = req.query.code
    const state = req.query.state
    const storedState = req.cookies[stateKey]

    //Spotify wants you to make sure state ID from them matches the one you sent earlier
    if (state !== storedState) {
        return res.redirect('/#' +
            querystring.stringify({
                error: 'state_mismatch'
            }))
    }

    res.clearCookie(stateKey)

    const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code,
            redirect_uri,
            grant_type: 'authorization_code'
        },
        headers: {
            'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
        },
        json: true
    }

    request.post(authOptions, async function (error, response, body) {
        if (!error && response.statusCode === 200) {
            req.session.access_token = body.access_token
            req.session.refresh_token = body.refresh_token

            res.cookie('access_token', body.access_token)
            res.cookie('refresh_token', body.refresh_token)

            const response = await fetch('https://api.spotify.com/v1/me', {
                headers: {
                    Authorization: `Bearer ${req.session.access_token}`,
                }
            })

            req.session.user = await response.json()

            await dao.initializeDatabaseForUser(req.session.user)

            return res.redirect('/')
        }

        res.redirect(`/#${querystring.stringify({error: 'invalid_token'})}`)
    })
})

router.get('/refresh_token', function (req, res) {
    const refresh_token = req.query.refresh_token
    const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))},
        form: {
            grant_type: 'refresh_token',
            refresh_token,
        },
        json: true
    }

    request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            const access_token = body.access_token
            res.send({access_token})
        }
    })
})

function ensureAuthenticated(req, res, next) {
    if (req.session.access_token) {
        return next();
    }
    res.redirect('/');
}

module.exports = {
    authRouter: router,
    ensureAuthenticated,
}
