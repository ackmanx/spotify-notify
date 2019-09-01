import {FETCH_NEW_ALBUMS_SUCCESS, LOADING_START, LOADING_STOP} from '../action-types'

const initialState = {
    //Default this to true so the no-results message banners aren't rendered before we get results back
    loading: true,
}

export function app(state = initialState, action = {}) {

    switch (action.type) {

        case LOADING_START: {
            return {...state, loading: true}
        }

        case LOADING_STOP: {
            return {...state, loading: false}
        }

        case FETCH_NEW_ALBUMS_SUCCESS: {
            return {...state, firstTimeUser: action.firstTimeUser, totalFollowedArtists: action.totalFollowedArtists}
        }

        default:
            return state
    }
}
