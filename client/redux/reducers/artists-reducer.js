import {FETCH_UNSEEN_ALBUMS_SUCCESS} from '../action-types'

const initialState = {}

export function artists(state = initialState, action = {}) {

    switch (action.type) {

        case FETCH_UNSEEN_ALBUMS_SUCCESS: {
            return {
                ...state,
                artistsWithUnseenAlbums: action.artistsWithUnseenAlbums,
                totalFollowedArtists: action.totalFollowedArtists,
                totalUnseenAlbums: action.totalUnseenAlbums
            }
        }

        default:
            return state
    }
}
