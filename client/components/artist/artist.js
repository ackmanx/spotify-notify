import './artist.css'
import React, {useContext} from 'react'
import {Album} from '../album/album'
import {AppContext} from '../../context'

export const Artist = ({id, name, albums}) => {
    const context = useContext(AppContext)

    if (!albums.length) {
        return null
    }

    return (
        <div className='artist-group'>
            <div className='artist-name' onClick={() => context.markArtistAsSeen(id)}>{name}</div>
            {albums.filter(album => album.type === 'album').map(album => <Album key={album.id} artistName={name} album={album}/>)}
            <hr/>
            {albums.filter(album => album.type === 'single').map(album => <Album key={album.id} artistName={name} album={album}/>)}
        </div>
    )
}
