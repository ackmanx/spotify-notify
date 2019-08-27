import React from 'react'
import {AppContext} from '../context'
import {Artist} from './artist/artist'
import {ActionBar} from './action-bar/action-bar'
import {Banner} from './banner/banner'
import {fetchNewAlbums, postSeenAlbums} from '../api/request-utils'
import {MessageBanners} from './banner/message-banners'

export class App extends React.Component {
    state = {
        artistsWithNewAlbums: {},
        firstTimeUser: false,
        //Default this to true so the message banners aren't rendered before we get results back
        loading: true,
        seenAlbums: [],
        totalFollowedArtists: 0,
        totalNewAlbums: 0,
        getNewAlbums: this.getNewAlbums.bind(this),
        markArtistAsSeen: this.markArtistAsSeen.bind(this),
        markAlbumAsSeen: this.markAlbumAsSeen.bind(this),
        submitSeenAlbums: this.submitSeenAlbums.bind(this),
    }

    componentDidMount() {
        this.getNewAlbums({shouldGetCached: true, appJustLoaded: true})
    }

    render() {
        const artistsWithNewAlbumsKeys = Object.keys(this.state.artistsWithNewAlbums || {})
        const hasNewAlbums = !!artistsWithNewAlbumsKeys.length

        return (
            <AppContext.Provider value={this.state}>
                <ActionBar/>

                <MessageBanners/>

                {hasNewAlbums && (
                    artistsWithNewAlbumsKeys.map(artistId => {
                        const artist = this.state.artistsWithNewAlbums[artistId];
                        return <Artist key={artist.id} artist={artist}/>
                    })
                )}
            </AppContext.Provider>
        )
    }

    getNewAlbums({shouldGetCached, appJustLoaded}) {
        //Prevent double-submissions, but also check this isn't a first-time load for a user
        if (this.state.loading && !appJustLoaded) return

        this.setState({loading: true}, async () => {
            const res = await fetchNewAlbums(shouldGetCached)

            this.setState({
                artistsWithNewAlbums: res.artists,
                totalFollowedArtists: res.totalFollowedArtists,
                totalNewAlbums: res.totalNewAlbums,
                //If we're getting the cache the user may be first-time, but if you are refreshing then you are no longer a first-time user
                firstTimeUser: shouldGetCached ? res.firstTimeUser : false,
                loading: false,
            })
        })
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
