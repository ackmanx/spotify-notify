import {UPDATE_SEEN_ALBUMS} from '../action-types'
import {postSeenAlbums} from '../../network/request-helpers'

export const markArtistAsSeen = artistId => {
    return async (dispatch, getState) => {
        const state = getState()

        const artist = state.artists.artistsWithNewAlbums[artistId]
        const albumsByArtist = artist.albums.map(album => album.id)

        dispatch({type: UPDATE_SEEN_ALBUMS, albumIds: albumsByArtist})
    }
}

export const markAlbumAsSeen = albumId => ({type: UPDATE_SEEN_ALBUMS, albumIds: [albumId]})

export const submitSeenAlbums = () => {
    return async (dispatch, getState) => {
        const state = getState()

        if (state.app.loading) return

        await postSeenAlbums(state.app.seenAlbums)

        document.location.reload()
    }
}
