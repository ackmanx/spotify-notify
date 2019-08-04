import './artist.css'
import React from 'react'
import {Album} from '../album/album'

export const Artist = ({name, albums}) => {
    return (
        <div className='artist-group'>
            <div className='artist-name'>{name}</div>
            {albums.map(album => <Album key={album.id} artist={name} album={album}/>)}
        </div>
    )
}
