import React from 'react'
import {connect} from 'react-redux'
import LazyLoad, {forceCheck} from 'react-lazyload'

import {Artist} from './components/artist/artist'
import {ActionBar} from './components/action-bar/action-bar'
import {Banners} from './components/banners/banners'
import {getUnseenAlbums} from './redux/actions/get-unseen-albums'
import {Placeholder} from './components/artist/placeholder/placeholder'

class _App extends React.Component {

    componentDidMount() {
        this.props.getUnseenAlbums({shouldGetCached: true, appJustLoaded: true})
    }

    componentDidUpdate(prev) {
        //On initial load, react-lazyload doesn't detect all elements in the viewport
        //Force a recheck of the viewport after we've verified all artist placeholders in the viewport have rendered
        if (!prev.allAlbumsInViewportRendered && this.props.allAlbumsInViewportRendered) {
            forceCheck()
        }
    }

    render() {
        const {artistsWithUnseenAlbums, loading} = this.props

        const artistsWithUnseenAlbumsKeys = Object.keys(artistsWithUnseenAlbums || {})
        const hasUnseenAlbums = !!artistsWithUnseenAlbumsKeys.length

        return <>
            {!loading && <ActionBar/>}

            <Banners/>

            {!loading && hasUnseenAlbums && (
                artistsWithUnseenAlbumsKeys.map((artistId) => {
                    const artist = artistsWithUnseenAlbums[artistId]

                    return (
                        <LazyLoad key={artistId}
                                  placeholder={<Placeholder name={artist.name}/>}>
                            <Artist key={artist.id} artist={artist}/>
                        </LazyLoad>
                    )
                })
            )}
        </>
    }
}

const mapStateToProps = state => ({
    allAlbumsInViewportRendered: state.app.allAlbumsInViewportRendered,
    artistsWithUnseenAlbums: state.artists.artistsWithUnseenAlbums,
    loading: state.app.loading,
})

const mapDispatchToProps = dispatch => ({
    getUnseenAlbums: options => dispatch(getUnseenAlbums(options))
})

export const App = connect(mapStateToProps, mapDispatchToProps)(_App)
