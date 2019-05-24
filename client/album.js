import './album.css'
import React from 'react'

export const Album = ({album: {id, name, url, coverArt}}) => {
    return (
        <>
            <a href={url} target='_blank'>
                <img src={coverArt} alt={name}/>
            </a>
        </>
    )
}
