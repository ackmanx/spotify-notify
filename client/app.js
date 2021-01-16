import React from 'react'
import { connect } from 'react-redux'
import LazyLoad, { forceCheck } from 'react-lazyload'

import { Artist } from './components/artist/artist'
import { ActionBar } from './components/action-bar/action-bar'
import { Banners } from './components/banners/banners'
import { getUnseenAlbums } from './redux/actions/get-unseen-albums'
import { fetchHeartbeat } from './utils/request-helpers'
import { Placeholder } from './components/artist/placeholder/placeholder'

class _App extends React.Component {
    componentDidMount() {
        this.props.getUnseenAlbums({ shouldGetCached: true, appJustLoaded: true })
        this.enableHeartbeat()
    }

    componentDidUpdate(prev) {
        //On initial load, react-lazyload doesn't detect all elements in the viewport
        //Force a recheck of the viewport after we've verified all artist placeholders in the viewport have rendered
        if (!prev.allAlbumsInViewportRendered && this.props.allAlbumsInViewportRendered) {
            //Putting this on the next tick so it doesn't run before React finishes rendering
            setTimeout(() => forceCheck(), 0)
        }
    }

    enableHeartbeat() {
        setInterval(() => {
            fetchHeartbeat().catch((e) => console.error('heartbeat failed', e))
        }, 1200000) //20 minutes
    }

    render() {
        const { artistsWithUnseenAlbums, loading } = this.props

        const artistsWithUnseenAlbumsKeys = Object.keys(artistsWithUnseenAlbums || {})
        const hasUnseenAlbums = !!artistsWithUnseenAlbumsKeys.length

        return (
            <>
                {!loading && <ActionBar />}

                <Banners />

                {!loading &&
                    hasUnseenAlbums &&
                    artistsWithUnseenAlbumsKeys.map((artistId) => {
                        const artist = artistsWithUnseenAlbums[artistId]

                        return (
                            //Lazy load artists for performance reasons
                            //If we have hundreds of artists, then even though the images are lazy loaded separately, the artist components and handlers are all loaded
                            //This causes crazy slowdowns when interacting with the mobile modal or meta menu
                            <LazyLoad key={artistId} placeholder={<Placeholder name={artist.name} />}>
                                <Artist key={artist.id} artist={artist} />
                            </LazyLoad>
                        )
                    })}
            </>
        )
    }
}

const mapStateToProps = (state) => ({
    allAlbumsInViewportRendered: state.app.allAlbumsInViewportRendered,
    artistsWithUnseenAlbums: state.artists.artistsWithUnseenAlbums,
    loading: state.app.loading,
})

const mapDispatchToProps = (dispatch) => ({
    getUnseenAlbums: (options) => dispatch(getUnseenAlbums(options)),
})

export const App = connect(mapStateToProps, mapDispatchToProps)(_App)
