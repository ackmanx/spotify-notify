const express = require('express')
const router = express.Router()
const fetch = require('node-fetch')
const {ensureAuthenticated} = require('./auth')
const db = require('../db/db')

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

/* DEV testing endpoint */
//https://developer.spotify.com/documentation/web-api/reference-beta/#endpoint-get-followed
router.get('/get-following', ensureAuthenticated, async function (req, res) {
    res.json(await spotifyAPI(req, '/me/following?type=artist&limit=50'))
})

/* DEV testing endpoint */
//https://developer.spotify.com/documentation/web-api/reference-beta/#endpoint-get-an-artists-albums
router.get('/get-artist-albums', ensureAuthenticated, async function (req, res) {
    const id = req.query.artistId

    if (!id) {
        return res.json({error: 'You need to specify an artist ID'})
    }

    res.json(await spotifyAPI(req, `/artists/${id}/albums?include_groups=album,single&market=US&limit=50`))
})

/* This is the only endpoint the app uses to fetch Spotify data */
router.get('/get-new-albums', ensureAuthenticated, async function (req, res) {
    if (req.query.refresh !== 'true') {
        return res.json(getNewAlbumCache(req.session.user.id))
    }

    let body = {}
    const dbRecord = db.get(req.session.user.id)
    const userSeenAlbums = dbRecord.seenAlbums || []

    body = require('../mock/api/get-new-albums--cached')

    // const followedArtistsFromSpotify = await spotifyAPI(req, '/me/following?type=artist&limit=50')
    // followedArtistsFromSpotify.artists.items.forEach(artist =>
    //     body[artist.id] = {
    //         id: artist.id,
    //         name: artist.name,
    //     }
    // )
    //
    // const allAlbumsPromises = []
    //
    // for (let artistId in body) {
    //     allAlbumsPromises.push(spotifyAPI(req, `/artists/${artistId}/albums?include_groups=album,single&market=US&limit=50`))
    // }
    //
    // const allAlbumsFollowedArtists = await Promise.all(allAlbumsPromises)
    // allAlbumsFollowedArtists.forEach(allAlbumsForSingleArtist => {
    //     const [, artistId] = allAlbumsForSingleArtist.href.match(/artists\/(.+)\/albums/)
    //
    //     let albums = body[artistId].albums
    //     if (!Array.isArray(albums)) albums = []
    //
    //     allAlbumsForSingleArtist.items.forEach(album => {
    //         if (userSeenAlbums.includes(album.id)) return
    //
    //         albums.push({
    //             id: album.id,
    //             name: album.name,
    //             url: album.external_urls.spotify,
    //             coverArt: album.images[1].url, //response always has 3 images of diff sizes, and I always want the middle one
    //         })
    //     })
    //
    //     body[artistId].albums = albums
    // })

    dbRecord.newAlbumsCache = body
    db.set(req.session.user.id, dbRecord)

    res.json(body)
})

function getNewAlbumCache(userId) {
    return db.get(userId).newAlbumsCache
}

module.exports = router