import React, {useContext, useEffect, useState} from 'react'
import {AppContext} from './context'
import {Artist} from './artist'

export class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            albums: {},
        }

        const init = async () => {
            const response = await fetch('/api/get-new-albums')
            this.state.albums = await response.json()
        }

        init()
    }

    render() {
        return (
            <AppContext.Provider value={this.state}>
                {/* loop through state albums here, building artist for each */}
                <Artist />
            </AppContext.Provider>
        )
    }
}
