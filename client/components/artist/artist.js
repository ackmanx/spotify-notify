import './artist.less'
import React from 'react'
import {connect} from 'react-redux'

import {Album} from '../album/album'
import {markArtistAsSeen} from '../../redux/actions/seen-albums'

const _Artist = props => {
    const {artist, markArtistAsSeen} = props

    const albums = artist.albums.filter(album => album.type === 'album')
    const singles = artist.albums.filter(album => album.type === 'single')

    const hasAlbums = !!albums.length
    const hasSingles = !!singles.length

    if (!hasAlbums && !hasSingles) {
        return null
    }

    return (
        <div className='artist-group'>
            <h2 className='artist-name' onClick={() => markArtistAsSeen(artist.id)}>{artist.name}</h2>

            {hasAlbums && <>
                <h3 className='album-group-title'>Albums</h3>
                {albums.map(album => <Album key={album.id} album={album}/>)}
            </>}

            {hasSingles && <>
                <h3 className='album-group-title'>Singles</h3>
                {singles.map(album => <Album key={album.id} album={album}/>)}
            </>}
        </div>
    )
}

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({
    markArtistAsSeen: artistId => dispatch(markArtistAsSeen(artistId))
})

export const Artist = connect(mapStateToProps, mapDispatchToProps)(_Artist)
