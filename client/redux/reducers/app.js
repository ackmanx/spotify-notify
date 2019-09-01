import {FETCH_NEW_ALBUMS_SUCCESS, LOADING_START, LOADING_STOP, UPDATE_SEEN_ALBUMS} from '../action-types'

const initialState = {
    //Default this to true so the no-results message banners aren't rendered before we get results back
    loading: true,
    seenAlbums: [],
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

        case UPDATE_SEEN_ALBUMS: {
            let seenAlbums = state.seenAlbums.slice()

            //todo: be nice to add albumId to an array, and then operate on it the same as when passed an array
            //todo: also need to prevent duplicates from being sent
            if (action.albumId) {
                const seenAlbumIndex = seenAlbums.indexOf(action.albumId)

                if (seenAlbumIndex !== -1) {
                    seenAlbums.splice(seenAlbumIndex, 1)
                }
                else {
                    seenAlbums.push(action.albumId)
                }
            }
            else {
                seenAlbums = seenAlbums.concat(action.albumIds)
            }

            return {...state, seenAlbums}
        }

        default:
            return state
    }
}
