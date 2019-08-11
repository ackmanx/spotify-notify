import './artist.css'
import React, {useContext} from 'react'
import {Album} from '../album/album'
import {AppContext} from '../../context'

export const Artist = ({artist}) => {
    const context = useContext(AppContext)

    if (!artist.albums.length) {
        return null
    }

    return (
        <div className='artist-group'>
            <div className='artist-name' onClick={() => context.markArtistAsSeen(artist.id)}>{artist.name}</div>
            {artist.albums.filter(album => album.type === 'album').map(album => <Album key={album.id} artistName={artist.name} album={album}/>)}
            <hr/>
            {artist.albums.filter(album => album.type === 'single').map(album => <Album key={album.id} artistName={artist.name} album={album}/>)}
        </div>
    )
}
