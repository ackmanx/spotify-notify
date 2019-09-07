import './album-details.css'
import React from 'react'

export const AlbumDetails = props => {
    const {album} = props

    return <>
        <div className='album-name'>{album.name}</div>
        <div>{album.releaseDate}</div>
    </>
}
