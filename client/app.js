import React from 'react'
import {connect} from 'react-redux'

import {Artist} from './components/artist/artist'
import {ActionBar} from './components/action-bar/action-bar'
import {MessageBanners} from './components/banner/message-banners'
import {getUnseenAlbums} from './redux/actions/get-unseen-albums'

class _App extends React.Component {

    componentDidMount() {
        this.props.getUnseenAlbums({shouldGetCached: true, appJustLoaded: true})
    }

    render() {
        const {artistsWithUnseenAlbums} = this.props

        const artistsWithUnseenAlbumsKeys = Object.keys(artistsWithUnseenAlbums || {})
        const hasUnseenAlbums = !!artistsWithUnseenAlbumsKeys.length

        return <>
            <ActionBar/>

            <MessageBanners/>

            {hasUnseenAlbums && (
                artistsWithUnseenAlbumsKeys.map(artistId => {
                    const artist = artistsWithUnseenAlbums[artistId];
                    return <Artist key={artist.id} artist={artist}/>
                })
            )}
        </>
    }
}

const mapStateToProps = state => ({
    artistsWithUnseenAlbums: state.artists.artistsWithUnseenAlbums,
})

const mapDispatchToProps = dispatch => ({
    getUnseenAlbums: options => dispatch(getUnseenAlbums(options))
})

export const App = connect(mapStateToProps, mapDispatchToProps)(_App)
