import {FETCH_NEW_ALBUMS_SUCCESS} from '../action-types'

const initialState = {}

export function artists(state = initialState, action = {}) {

    switch (action.type) {

        case FETCH_NEW_ALBUMS_SUCCESS: {
            return {
                ...state,
                artistsWithNewAlbums: action.artistsWithNewAlbums,
                totalFollowedArtists: action.totalFollowedArtists,
                totalNewAlbums: action.totalNewAlbums
            }
        }

        default:
            return state
    }
}
