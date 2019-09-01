import React from 'react'
import {connect} from 'react-redux'

import {Artist} from './components/artist/artist'
import {ActionBar} from './components/action-bar/action-bar'
import {MessageBanners} from './components/banner/message-banners'
import {getNewAlbums} from './redux/actions/get-new-albums'

class _App extends React.Component {

    componentDidMount() {
        this.props.getNewAlbums({shouldGetCached: true, appJustLoaded: true})
    }

    render() {
        const {artistsWithNewAlbums} = this.props

        const artistsWithNewAlbumsKeys = Object.keys(artistsWithNewAlbums || {})
        const hasNewAlbums = !!artistsWithNewAlbumsKeys.length

        console.log('###', 'App render')

        return <>
            <ActionBar/>

            <MessageBanners/>

            {hasNewAlbums && (
                artistsWithNewAlbumsKeys.map(artistId => {
                    const artist = artistsWithNewAlbums[artistId];
                    return <Artist key={artist.id} artist={artist}/>
                })
            )}
        </>
    }
}

const mapStateToProps = state => ({
    artistsWithNewAlbums: state.artists.artistsWithNewAlbums,
})

const mapDispatchToProps = dispatch => ({
    getNewAlbums: options => dispatch(getNewAlbums(options))
})

export const App = connect(mapStateToProps, mapDispatchToProps)(_App)
