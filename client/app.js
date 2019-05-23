import React, {useContext, useEffect, useState} from 'react'
import {AppContext} from './context'
import {Artist} from './artist'

export class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            artistsWithNewAlbums: {},
        }

        const init = async () => {
            const response = await fetch('/api/get-new-albums')
            this.setState({artistsWithNewAlbums: await response.json()})
        }

        init()
    }

    render() {
        return (
            <AppContext.Provider value={this.state}>
                {Object.keys(this.state.artistsWithNewAlbums).map(artistID => <Artist key={artistID} data={this.state.artistsWithNewAlbums[artistID]} />)}
            </AppContext.Provider>
        )
    }
}
