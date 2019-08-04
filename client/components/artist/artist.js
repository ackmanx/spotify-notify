import './artist.css'
import React, {useContext} from 'react'
import {Album} from '../album/album'
import {AppContext} from '../../context'

export const Artist = ({artistId, name, albums}) => {
    const context = useContext(AppContext)

    if (!albums.length) {
        return null
    }

    return (
        <div className='artist-group'>
            <div className='artist-name' onClick={() => context.markArtistAsSeen(artistId)}>{name}</div>
            {albums.map(album => <Album key={album.id} artist={name} album={album}/>)}
        </div>
    )
}
