import React from 'react'
import {connect} from 'react-redux'
import LazyLoad, {forceCheck} from 'react-lazyload'

import {Artist} from './components/artist/artist'
import {ActionBar} from './components/action-bar/action-bar'
import {MessageBanners} from './components/banner/message-banners'
import {getUnseenAlbums} from './redux/actions/get-unseen-albums'
import {Placeholder} from './components/artist/placeholder/placeholder'

class _App extends React.Component {

    componentDidMount() {
        this.props.getUnseenAlbums({shouldGetCached: true, appJustLoaded: true})

        //On initial load, react-lazyload doesn't detect all elements in the viewport
        //Force a recheck of the viewport, but not immediately because the DOM might isn't ready immediately
        //todo majerus: This number doesn't work because slow networks cause delays, then it triggers too early
        //todo majerus: How to detect until after a few things are rendered? For example, check each artist untl it's not on the viewport
        //todo majerus: Then set a flag so this triggers in a componentDidUpdate?
        setTimeout(() => forceCheck(), 100)
    }

    render() {
        const {artistsWithUnseenAlbums, loading} = this.props

        const artistsWithUnseenAlbumsKeys = Object.keys(artistsWithUnseenAlbums || {})
        const hasUnseenAlbums = !!artistsWithUnseenAlbumsKeys.length

        return <>
            {!loading && <ActionBar/>}

            <MessageBanners/>

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
    artistsWithUnseenAlbums: state.artists.artistsWithUnseenAlbums,
    loading: state.app.loading,
})

const mapDispatchToProps = dispatch => ({
    getUnseenAlbums: options => dispatch(getUnseenAlbums(options))
})

export const App = connect(mapStateToProps, mapDispatchToProps)(_App)
