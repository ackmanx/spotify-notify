import React from 'react'
import {AppContext} from '../../context'
import {Artist} from '../artist/artist'
import {ActionBar} from '../action-bar/action-bar'

export class App extends React.Component {
    state = {
        artistsWithNewAlbums: {},
        seenAlbums: [],
        markAsSeen: this.markAsSeen.bind(this),
        refreshNewAlbums: this.refreshNewAlbums.bind(this),
        submitSeenAlbums: this.submitSeenAlbums.bind(this),
    }

    constructor(props) {
        super(props)
        //todo: this should make a call for cached, not refresh. dev purposes only
        this.refreshNewAlbums()
    }

    render() {
        return (
            <AppContext.Provider value={this.state}>
                <ActionBar/>
                {Object
                    .keys(this.state.artistsWithNewAlbums)
                    .map(artistID => {
                        const artist = this.state.artistsWithNewAlbums[artistID];
                        return <Artist key={artistID} name={artist.name} albums={artist.albums}/>
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

    markAsSeen(albumId) {
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
