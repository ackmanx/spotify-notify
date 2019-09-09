import {fetchUnseenAlbums} from '../../utils/request-helpers'
import {FETCH_UNSEEN_ALBUMS_SUCCESS, LOADING_START, LOADING_STOP} from '../action-types'

export const getUnseenAlbums = ({appJustLoaded, shouldGetCached}) => {
    return async (dispatch, getState) => {
        const state = getState()

        //Prevent double-submissions, but also check this isn't a first-time load for a user
        if (state.app.loading && !appJustLoaded) return

        dispatch({type: LOADING_START})

        const res = await fetchUnseenAlbums(shouldGetCached)

        dispatch({type: LOADING_STOP})

        dispatch({
            type: FETCH_UNSEEN_ALBUMS_SUCCESS,
            username: res.name,
            artistsWithUnseenAlbums: res.artists,
            firstTimeUser: res.firstTimeUser,
            totalFollowedArtists: res.totalFollowedArtists,
            totalUnseenAlbums: res.totalUnseenAlbums,
        })
    }
}
