import React from 'react'
import {AppContext} from './context'
import {Artist} from './artist'

export class App extends React.Component {
    state = {
        artistsWithNewAlbums: {},
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
                {Object
                    .keys(this.state.artistsWithNewAlbums)
                    .map(artistID => {
                        const artist = this.state.artistsWithNewAlbums[artistID];
                        return <Artist key={artistID} name={artist.name} albums={artist.albums}/>
                    })}
            </AppContext.Provider>
        )
    }
}
