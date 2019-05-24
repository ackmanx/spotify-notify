import './artist.css'
import React from 'react'

export const Artist = ({name, albums}) => {
    return (
        <div>
            <h2 className='artist-name'>{name}</h2>
        </div>
    )
}
