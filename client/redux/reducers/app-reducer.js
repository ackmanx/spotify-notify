import {FETCH_UNSEEN_ALBUMS_SUCCESS, LOADING_START, LOADING_STOP, UPDATE_SEEN_ALBUMS} from '../action-types'

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

        case FETCH_UNSEEN_ALBUMS_SUCCESS: {
            return {...state, firstTimeUser: action.firstTimeUser, username: action.username}
        }

        case UPDATE_SEEN_ALBUMS: {
            let seenAlbums = state.seenAlbums.slice()

            action.albumIds.forEach(albumId => {
                const seenAlbumIndex = seenAlbums.indexOf(albumId)

                if (seenAlbumIndex !== -1) {
                    seenAlbums.splice(seenAlbumIndex, 1)
                }
                else {
                    seenAlbums.push(albumId)
                }
            })

            return {...state, seenAlbums}
        }

        default:
            return state
    }
}
