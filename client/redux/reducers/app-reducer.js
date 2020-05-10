import {ALL_ALBUMS_IN_VIEWPORT_RENDERED, FETCH_UNSEEN_ALBUMS_FINISHED, LOADING_START, LOADING_STOP, UPDATE_SEEN_ALBUMS} from '../action-types'

const initialState = {
    allAlbumsInViewportRendered: false,
    //Default this to true so the no-results message banners aren't rendered before we get results back
    loading: true,
    seenAlbums: [],
}

export function app(state = initialState, action = {}) {

    switch (action.type) {

        case ALL_ALBUMS_IN_VIEWPORT_RENDERED: {
            return {...state, allAlbumsInViewportRendered: true}
        }

        case LOADING_START: {
            return {...state, loading: true, isRefresh: action.isRefresh}
        }

        case LOADING_STOP: {
            return {...state, loading: false, isRefresh: undefined}
        }

        case FETCH_UNSEEN_ALBUMS_FINISHED: {
            return {...state, firstTimeUser: action.firstTimeUser, username: action.username, error: action.error}
        }

        case UPDATE_SEEN_ALBUMS: {
            let seenAlbums = state.seenAlbums.slice()

            const shouldUnmarkAll = action.albumIdsToMarkAsSeen.every(albumId => seenAlbums.includes(albumId))

            //Either they all get unmarked, or remaining unmarked for an artist get marked
            action.albumIdsToMarkAsSeen.forEach(albumId => {
                if (shouldUnmarkAll) {
                    seenAlbums.splice(seenAlbums.indexOf(albumId), 1)
                } else if (!seenAlbums.includes(albumId)) {
                    seenAlbums.push(albumId)
                }
            })

            return {...state, seenAlbums}
        }

        default:
            return state
    }
}
