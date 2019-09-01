import React from 'react'
import {connect} from 'react-redux'

import {AppContext} from './context'
import {Artist} from './components/artist/artist'
import {ActionBar} from './components/action-bar/action-bar'
import {ConnectedMessageBanners} from './components/banner/message-banners'
import {fetchNewAlbums, postSeenAlbums} from './network/request-helpers'
import {getNewAlbums} from './redux/actions/get-new-albums'

class App extends React.Component {
    state = {
        artistsWithNewAlbums: {},
        firstTimeUser: false,
        seenAlbums: [],
        totalFollowedArtists: 0,
        totalNewAlbums: 0,
        markArtistAsSeen: this.markArtistAsSeen.bind(this),
        markAlbumAsSeen: this.markAlbumAsSeen.bind(this),
        submitSeenAlbums: this.submitSeenAlbums.bind(this),
    }

    componentDidMount() {
        console.log('###',  this.props)
        this.props.getNewAlbums({shouldGetCached: true, appJustLoaded: true})
    }

    render() {
        const {artistsWithNewAlbums} = this.props

        const artistsWithNewAlbumsKeys = Object.keys(artistsWithNewAlbums || {})
        const hasNewAlbums = !!artistsWithNewAlbumsKeys.length

        console.log('###', 'App render')

        return (
            <AppContext.Provider value={this.state}>
                <ActionBar/>

                <ConnectedMessageBanners/>

                {hasNewAlbums && (
                    artistsWithNewAlbumsKeys.map(artistId => {
                        const artist = this.state.artistsWithNewAlbums[artistId];
                        return <Artist key={artist.id} artist={artist}/>
                    })
                )}
            </AppContext.Provider>
        )
    }

    markArtistAsSeen(artistId) {
        const artist = this.state.artistsWithNewAlbums[artistId]
        const albumsByArtist = artist.albums.map(album => album.id)

        this.setState({seenAlbums: [...this.state.seenAlbums, ...albumsByArtist]})
    }

    markAlbumAsSeen(albumId) {
        const seenAlbums = [...this.state.seenAlbums]

        const seenAlbumIndex = seenAlbums.indexOf(albumId)

        if (seenAlbumIndex !== -1) {
            seenAlbums.splice(seenAlbumIndex, 1)
        } else {
            seenAlbums.push(albumId)
        }

        this.setState({seenAlbums})
    }

    async submitSeenAlbums() {
        if (this.state.loading) return

        await postSeenAlbums(this.state.seenAlbums)

        document.location.reload()
    }
}

const mapStateToProps = state => ({
    artistsWithNewAlbums: state.artists.artistsWithNewAlbums,
})

const mapDispatchToProps = dispatch => ({
    getNewAlbums: options => dispatch(getNewAlbums(options))
})

export const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App)
