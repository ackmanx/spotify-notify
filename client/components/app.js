import React from 'react'
import {AppContext} from '../context'
import {Artist} from './artist/artist'
import {ActionBar} from './action-bar/action-bar'

export class App extends React.Component {
    state = {
        artistsWithNewAlbums: {},
        seenAlbums: [],
        markArtistAsSeen: this.markArtistAsSeen.bind(this),
        markAlbumAsSeen: this.markAlbumAsSeen.bind(this),
        refreshNewAlbums: this.refreshNewAlbums.bind(this),
        submitSeenAlbums: this.submitSeenAlbums.bind(this),
    }

    constructor(props) {
        super(props)
        this.getNewAlbums()
    }

    render() {
        return (
            <AppContext.Provider value={this.state}>
                <ActionBar/>
                {Object
                    .keys(this.state.artistsWithNewAlbums)
                    .map(artistId => {
                        const artist = this.state.artistsWithNewAlbums[artistId];
                        return <Artist key={artist.id} name={artist.name} albums={artist.albums}/>
                    })}
            </AppContext.Provider>
        )
    }

    async getNewAlbums() {
        const response = await fetch('/api/new-albums/cached')
        this.setState({artistsWithNewAlbums: await response.json()})
    }

    async refreshNewAlbums() {
        const response = await fetch('/api/new-albums/refresh')
        this.setState({artistsWithNewAlbums: await response.json()})
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
        await fetch('/api/update-seen-albums',
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({albumIds: this.state.seenAlbums}),
            }
        )

        document.location.reload()
    }
}
