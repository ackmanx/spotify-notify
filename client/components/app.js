import React from 'react'
import {AppContext} from '../context'
import {Artist} from './artist/artist'
import {ActionBar} from './action-bar/action-bar'
import {Banner} from './banner/banner'
import {fetchNewReleases, postSeenReleases} from '../api/request-utils'

export class App extends React.Component {
    state = {
        artistsWithNewAlbums: {},
        loading: false,
        seenAlbums: [],
        getNewAlbums: this.getNewAlbums.bind(this),
        markArtistAsSeen: this.markArtistAsSeen.bind(this),
        markAlbumAsSeen: this.markAlbumAsSeen.bind(this),
        submitSeenAlbums: this.submitSeenAlbums.bind(this),
    }

    componentDidMount() {
        this.getNewAlbums({shouldGetCached: true})
    }

    render() {
        const artistsWithNewAlbumsKeys = Object.keys(this.state.artistsWithNewAlbums)

        return (
            <AppContext.Provider value={this.state}>
                <ActionBar/>

                {this.state.loading && <Banner text='Loading...'/>}
                {!this.state.loading && !artistsWithNewAlbumsKeys.length && <Banner text='Nothing new :('/>}

                {!!artistsWithNewAlbumsKeys.length && (
                    artistsWithNewAlbumsKeys.map(artistId => {
                        const artist = this.state.artistsWithNewAlbums[artistId];
                        return <Artist key={artist.id} artist={artist}/>
                    })
                )}
            </AppContext.Provider>
        )
    }

    getNewAlbums({shouldGetCached}) {
        if (this.state.loading) return

        this.setState({loading: true}, async () =>
            this.setState({
                artistsWithNewAlbums: await fetchNewReleases(shouldGetCached),
                loading: false
            })
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

        await postSeenReleases(this.state.seenAlbums)

        document.location.reload()
    }
}
