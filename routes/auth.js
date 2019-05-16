const express = require('express');
const router = express.Router();
const querystring = require('querystring');
const request = require('request');

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

const client_id = 'e466e7a286954e13b501d8e7bc4669cc';
const client_secret = '76f2fd5049574e09899dcf84810e5fef'; //this will live in heroku config so it isn't exposed via git, but until then store it here and regen a new key later
const redirect_uri = 'http://me:3000/auth/callback'; //where to be sent by spotify after logging in. this must be whitelisted in spotify developer dashboard first

const stateKey = 'spotify_auth_state';

// ---------------------------------------------------------------------------------
// REST
// ---------------------------------------------------------------------------------
router.get('/login', function (req, res) {
    const state = Math.random();
    res.cookie(stateKey, state);

    const queryString = querystring.stringify({
        response_type: 'code',
        client_id,
        scope: 'user-follow-modify',
        redirect_uri,
        state,
    })

    res.redirect(`https://accounts.spotify.com/authorize?${queryString}`);
});

router.get('/callback', function (req, res) {
    // your application requests refresh and access tokens
    // after checking the state parameter

    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies[stateKey] : null;

    console.log('state :', state);
    console.log('stored:', storedState);

    if (state === null || state !== storedState) {
        res.redirect('/#' +
            querystring.stringify({
                error: 'state_mismatch'
            }));
    } else {
        res.clearCookie(stateKey);
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
        };

        request.post(authOptions, function (error, response, body) {
            if (!error && response.statusCode === 200) {

                const access_token = body.access_token
                const refresh_token = body.refresh_token;

                const options = {
                    url: 'https://api.spotify.com/v1/me',
                    headers: {'Authorization': 'Bearer ' + access_token},
                    json: true
                };

                //Example using the token to make an authenticated API call
                request.get(options, function (error, response, body) {
                    console.log('### /v1/me body:', body);
                });

                // we can also pass the token to the browser to make requests from there
                res.redirect('/#' +
                    querystring.stringify({
                        access_token,
                        refresh_token,
                    }));
            } else {
                res.redirect(`/#${querystring.stringify({error: 'invalid_token'})}`);
            }
        });
    }
});

router.get('/refresh_token', function (req, res) {
    // requesting access token from refresh token
    const refresh_token = req.query.refresh_token;
    const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))},
        form: {
            grant_type: 'refresh_token',
            refresh_token,
        },
        json: true
    };

    request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            const access_token = body.access_token;
            res.send({access_token});
        }
    });
});

module.exports = router;
