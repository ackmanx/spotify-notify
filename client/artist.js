import './artist.css'
import React from 'react'
import {Album} from './album'

export const Artist = ({name, albums}) => {
    return (
        <div>
            <h2 className='artist-name'>{name}</h2>
            {albums.map(album => <Album key={album.id} album={album}/>)}
        </div>
    )
}
