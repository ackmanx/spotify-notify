import React, {useContext, useEffect, useState} from 'react'
import {AppContext} from './context'

export class App extends React.Component {
    constructor(props) {
        super(props)
        // this.state = {
        //     albums: {},
        //     setAlbums: this.setAlbums.bind(this)
        // }

        async function init() {
            const response = await fetch('/api/get-new-albums')
            const newAlbums = await response.json()
        }

        init()
    }

    // setAlbums(albums) {
    //     this.setState({albums})
    // }

    render() {
        return (
            <AppContext.Provider value={'hello'}>
                <SomethingElse />
            </AppContext.Provider>
        )
    }
}

class SomethingElse extends React.Component {
    render() {
        return <AppContext.Consumer>{context => context}</AppContext.Consumer>
    }
}
