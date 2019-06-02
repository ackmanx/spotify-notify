import './album.css'
import React from 'react'

export const Album = ({album: {id, name, url, coverArt}, artist}) => {
    const artistAlbumName = `${artist} - ${name}`

    return (
        <>
            <a href={url} target='_blank'>
                <img src={coverArt} title={artistAlbumName} alt={artistAlbumName}/>
            </a>
        </>
    )
}
