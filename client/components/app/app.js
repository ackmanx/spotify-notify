import React from 'react'
import {AppContext} from '../../context'
import {Artist} from '../artist/artist'
import {ActionBar} from '../action-bar/action-bar'

export class App extends React.Component {
    state = {
        artistsWithNewAlbums: {},
        markAsSeen: this.markAsSeen.bind(this),
        refreshNewAlbums: this.refreshNewAlbums.bind(this),
        seenAlbums: [],
    }

    constructor(props) {
        super(props)

        const init = async () => {
            const response = await fetch('/api/get-new-albums')
            this.setState({artistsWithNewAlbums: await response.json()})
        }

        init()
    }

    render() {
        return (
            <AppContext.Provider value={this.state}>
                <ActionBar />
                {Object
                    .keys(this.state.artistsWithNewAlbums)
                    .map(artistID => {
                        const artist = this.state.artistsWithNewAlbums[artistID];
                        return <Artist key={artistID} name={artist.name} albums={artist.albums}/>
                    })}
            </AppContext.Provider>
        )
    }

    async refreshNewAlbums() {
        const response = await fetch('/api/get-new-albums?refresh=true')
        this.setState({artistsWithNewAlbums: await response.json()})
    }

    markAsSeen(albumId) {
        const seenAlbums = [...this.state.seenAlbums]

        const seenAlbumIndex = seenAlbums.indexOf(albumId)

        if (seenAlbumIndex !== -1) {
            seenAlbums.splice(seenAlbumIndex, 1)
        }
        else {
            seenAlbums.push(albumId)
        }

        this.setState({seenAlbums})
    }
}
