import './artist.css'
import React from 'react'
import {connect} from 'react-redux'

import {Album} from '../album/album'
import {markArtistAsSeen} from '../../redux/actions/seen-albums'

const _Artist = props => {
    console.log('###', 'Artist render')

    const {artist, markArtistAsSeen} = props

    if (!artist.albums.length) {
        return null
    }

    const albums = artist.albums.filter(album => album.type === 'album')
    const singles = artist.albums.filter(album => album.type === 'single')

    return (
        <div className='artist-group'>
            <div className='artist-name' onClick={() => markArtistAsSeen(artist.id)}>{artist.name}</div>

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


const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({
    markArtistAsSeen: artistId => dispatch(markArtistAsSeen(artistId))
})

export const Artist = connect(mapStateToProps, mapDispatchToProps)(_Artist)
