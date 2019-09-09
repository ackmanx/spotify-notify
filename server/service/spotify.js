const path = require('path')
const debug = require('debug')(`sn:${path.basename(__filename)}`)
const {getUserData, saveUserData, Slices} = require('../db/dao')
const {fetchAllPages} = require('./request-helpers')

/*
 * This transforms lists of artists' albums responses from Spotify into the contract for the cache
 * This operates on all the artists and their albums, not just a single artist's albums
 * Note that this is an array of API response pages, so there may be several pages for a single artist if they have a lot of albums
 */
async function transformSpotifyArtistAlbumPagesToCache(pagesOfArtistAlbums, freshAlbumsCache, userId) {
    const userSeenAlbums = await getUserData(userId, Slices.seenAlbums)

    pagesOfArtistAlbums.forEach(artistAlbumPage => {
        //The albums response from Spotify does not contain the artistId used for searching except in the href and artists array
        //However, being the album could be a collab, there may be multiple artists in the array and order is not predictable
        //Being we don't know the artistId used for searching in this loop, we have to pull it out of the href
        const [, artistId] = artistAlbumPage.href.match(/artists\/(.+)\/albums/)

        const artistInCache = freshAlbumsCache.artists[artistId]
        const allAlbumsForAnArtist = artistInCache.albums || []

        //Build the cache for each album in this artist page
        artistAlbumPage.items.forEach(album => {
            if (userSeenAlbums.includes(album.id)) return

            allAlbumsForAnArtist.push({
                id: album.id,
                name: album.name,
                artistName: artistInCache.name,
                coverArt: album.images[1].url, //response always has 3 images of diff sizes, and I always want the middle one
                releaseDate: album.release_date,
                type: album.album_type,
                spotifyUri: album.uri,
                spotifyWebPlayerUrl: album.external_urls.spotify,
            })
        })

        artistInCache.albums = allAlbumsForAnArtist
    })

    let totalUnseenAlbums = 0

    Object.entries(freshAlbumsCache.artists).forEach(([artistId, artist]) => {
        //Remove artists from cache if all of their albums have been seen
        if (!artist.albums.length) {
            delete freshAlbumsCache.artists[artistId]
            return
        }

        totalUnseenAlbums += Object.keys(artist.albums).length

        //Sort albums in descending order by their release date
        artist.albums.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))
    })

    freshAlbumsCache.totalUnseenAlbums = totalUnseenAlbums
}

exports.checkForUnseenAlbums = async function checkForUnseenAlbums(session) {
    const userId = session.user.id
    let followedArtistsPagesFromSpotify

    debug(`Getting followed artists for ${userId}`)

    if (process.env.MOCK) {
        followedArtistsPagesFromSpotify = [require('../resources/mocks/spotify/v1-me-following')]
    }
    else {
        followedArtistsPagesFromSpotify = await fetchAllPages(session.access_token, '/me/following?type=artist&limit=50')
    }

    const totalFollowedArtists = followedArtistsPagesFromSpotify[0].artists.total

    let freshAlbumsCache = {
        artists: {},
        totalUnseenAlbums: 0,
    }

    debug(`User ${userId}: Following ${totalFollowedArtists} artists`)

    followedArtistsPagesFromSpotify.forEach(followedPage =>
        followedPage.artists.items.forEach(artist =>
            freshAlbumsCache.artists[artist.id] = {
                id: artist.id,
                name: artist.name,
            }
        )
    )

    debug(`User ${userId}: Fetching albums for ${Object.keys(freshAlbumsCache.artists).length} artists`)

    const allAlbumsPagesOfFollowedArtists = []

    for (let artistId in freshAlbumsCache.artists) {
        try {
            const albumsPages = await fetchAllPages(session.access_token, `/artists/${artistId}/albums?include_groups=album,single&market=US&limit=50`)
            //Spread albums because fetchAlbumsAllPages returns an array of responses, and we want this array to be flat of all artists and albums
            allAlbumsPagesOfFollowedArtists.push(...albumsPages)
        }
        catch (e) {
            console.error(e)
        }
    }

    //Update the Spotify responses to conform to our cache contract
    await transformSpotifyArtistAlbumPagesToCache(allAlbumsPagesOfFollowedArtists, freshAlbumsCache, userId)

    const user = await getUserData(userId, Slices.user)
    user.totalFollowedArtists = totalFollowedArtists

    await saveUserData(userId, Slices.user, user)
    await saveUserData(userId, Slices.unseenAlbumsCache, freshAlbumsCache)

    return {...freshAlbumsCache, ...user}
}
