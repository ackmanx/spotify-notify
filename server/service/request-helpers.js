const delay = require('delay')
const fetch = require('node-fetch')

async function spotifyAPI(accessToken, endpoint) {
    const options = {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        }
    }

    const spotifyApiURL = endpoint.startsWith('http') ? endpoint : `https://api.spotify.com/v1${endpoint}`

    let response = await fetch(spotifyApiURL, options)

    if (response.status === 429) {
        const retryAfterSeconds = response.headers.get('retry-after') //for some reason `get` is the official way to return headers

        debug(`Throttled by Spotify, retrying ${spotifyApiURL} after ${retryAfterSeconds} seconds`)

        await delay(retryAfterSeconds)

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
function getPagingNextUrl(response) {
    if (response.next) return response.next

    if (response.artists && response.artists.next) return response.artists.next
}

exports.fetchAllPages = async function fetchAllPages(accessToken, relativeSpotifyUrl) {
    const results = []

    let response = await spotifyAPI(accessToken, relativeSpotifyUrl)
    let nextPageAbsoluteUrl = getPagingNextUrl(response)

    results.push(response)

    while (nextPageAbsoluteUrl) {
        response = await spotifyAPI(accessToken, nextPageAbsoluteUrl)
        nextPageAbsoluteUrl = getPagingNextUrl(response)
        results.push(response)
    }

    return results
}
