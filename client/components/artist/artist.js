import './artist.css'
import React, {useContext} from 'react'
import {Album} from '../album/album'
import {AppContext} from '../../context'

export const Artist = ({artist}) => {
    console.log('###', 'Artist render')

    const context = useContext(AppContext)

    if (!artist.albums.length) {
        return null
    }

    const albums = artist.albums.filter(album => album.type === 'album')
    const singles = artist.albums.filter(album => album.type === 'single')

    return (
        <div className='artist-group'>
            <div className='artist-name' onClick={() => context.markArtistAsSeen(artist.id)}>{artist.name}</div>

            {!!albums.length && <>
                <div className='album-group-title'>Albums</div>
                {albums.map(album => <Album key={album.id} artistName={artist.name} album={album}/>)}
            </>}

            {!!singles.length && <>
                <div className='album-group-title'>Singles</div>
                {singles.map(album => <Album key={album.id} artistName={artist.name} album={album}/>)}
            </>}
        </div>
    )
}
