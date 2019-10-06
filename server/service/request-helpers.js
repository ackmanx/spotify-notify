const delay = require('delay')
const fetch = require('node-fetch')
const path = require('path')
const debug = require('debug')(`sn:${path.basename(__filename)}`)

async function spotifyAPI(accessToken, endpoint) {
    const options = {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        }
    }

    const spotifyApiURL = endpoint.startsWith('http') ? endpoint : `https://api.spotify.com/v1${endpoint}`

    let response = await fetch(spotifyApiURL, options)

    if (response.status === 401) {
        debug('Access token expired. Get a new one! Or put code here that does it automatically')
    }

    if (response.status === 429) {
        const retryAfterSeconds = response.headers.get('retry-after') //for some reason `get` is the official way to return headers

        debug(`Throttled by Spotify, retrying ${spotifyApiURL} after ${retryAfterSeconds} seconds`)

        await delay(retryAfterSeconds * 1000)

        response = await fetch(spotifyApiURL, options)

        if (!response.ok) {
            debug(`Uh oh, the retry after throttle failed too! We got a ${response.status} ${response.statusText} from Spotify`)
        }
    }

    const responseBody = await response.json()

    if (!response.ok) {
        debug(`Uh oh, the Spotify API request failed (${spotifyApiURL})! Here's what they had to say: ${JSON.stringify(responseBody)}`)
        return
    }

    return responseBody
}

//Spotify puts the paging object in different places for their APIs, so we have to check multiple locations for `next`
function getPagingNextUrl(responseBody) {
    if (responseBody.next) return responseBody.next

    if (responseBody.artists && responseBody.artists.next) return responseBody.artists.next
}

exports.fetchAllPages = async function fetchAllPages(accessToken, relativeSpotifyUrl) {
    const results = []

    let responseBody = await spotifyAPI(accessToken, relativeSpotifyUrl)
    let nextPageAbsoluteUrl = getPagingNextUrl(responseBody)

    results.push(responseBody)

    while (nextPageAbsoluteUrl) {
        responseBody = await spotifyAPI(accessToken, nextPageAbsoluteUrl)
        nextPageAbsoluteUrl = getPagingNextUrl(responseBody)
        results.push(responseBody)
    }

    return results
}
