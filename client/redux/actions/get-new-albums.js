import {fetchNewAlbums} from '../../network/request-helpers'
import {FETCH_NEW_ALBUMS_SUCCESS, LOADING_START, LOADING_STOP} from '../action-types'

export const getNewAlbums = ({appJustLoaded, shouldGetCached}) => {
    return async (dispatch, getState) => {
        const state = getState()

        //Prevent double-submissions, but also check this isn't a first-time load for a user
        if (state.app.loading && !appJustLoaded) return

        dispatch({type: LOADING_START})

        const res = await fetchNewAlbums(shouldGetCached)

        dispatch({type: LOADING_STOP})

        dispatch({
            type: FETCH_NEW_ALBUMS_SUCCESS,
            artistsWithNewAlbums: res.artists,
            firstTimeUser: res.firstTimeUser,
            totalFollowedArtists: res.totalFollowedArtists,
            totalNewAlbums: res.totalNewAlbums,
        })

        // If we're getting the cache the user may be first-time, but if you are refreshing then you are no longer a first-time user
            // firstTimeUser: shouldGetCached ? res.firstTimeUser : false,
    }
}
