import './album.css'
import React from 'react'

export const Album = ({album: {id, name, url, coverArt}}) => {
    return (
        <div>
            {name}
        </div>
    )
}
