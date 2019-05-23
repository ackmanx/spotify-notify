import React, { useEffect } from 'react'

export const App = () => {

    //hook callback cannot be async, so React recommends making an async function within and invoking immediately
    useEffect(() => {
        async function init() {
            const response = await fetch('/api/get-new-albums')
            const newAlbums = await response.json()
            console.log(newAlbums);
        }
        init()
    }, [])

    return <h2>yo</h2>
}
