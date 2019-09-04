import './artist.css'
import React, {useState} from 'react'
import {connect} from 'react-redux'

import {Album} from '../album/album'
import {markArtistAsSeen} from '../../redux/actions/seen-albums'

let counter = 0

//A reset is needed once all the albums are loaded
//This is so a refresh, which doesn't reload the page, doesn't make the first 10 lazy
function addAlbum(album, counterResetHint) {
    counter++

    if (counter >= counterResetHint) counter = 0

    if (counter > 10) {
        return <Album key={album.id} artistName={album.artistName} album={album} lazyLoad/>
    }

    return <Album key={album.id} artistName={album.artistName} album={album}/>
}

const _Artist = props => {
    const {artist, counterResetHint, markArtistAsSeen} = props

    const albums = artist.albums.filter(album => album.type === 'album')
    const singles = artist.albums.filter(album => album.type === 'single')

    const hasAlbums = !!albums.length
    const hasSingles = !!singles.length

    if (!hasAlbums && !hasSingles) {
        return null
    }

    const [hover, setHover] = useState(false);

    const toggleOverlay = () => setHover(!hover)

    return (
        <div className='artist-group'>
            <div className='artist-name-container' onMouseEnter={toggleOverlay} onMouseLeave={toggleOverlay}>
                <h2 className='artist-name' onClick={() => markArtistAsSeen(artist.id)}>{artist.name}</h2>
                {hover && <img src='album-actions/ghost.png' alt='mark as seen'/>}
            </div>

            {hasAlbums && <>
                <h3 className='album-group-title'>Albums</h3>
                {albums.map(album => addAlbum(album, counterResetHint))}
            </>}

            {hasSingles && <>
                <h3 className='album-group-title'>Singles</h3>
                {singles.map(album => addAlbum(album, counterResetHint))}
            </>}
        </div>
    )
}

const mapStateToProps = state => ({
    counterResetHint: state.artists.totalNewAlbums
})

const mapDispatchToProps = dispatch => ({
    markArtistAsSeen: artistId => dispatch(markArtistAsSeen(artistId))
})

export const Artist = connect(mapStateToProps, mapDispatchToProps)(_Artist)
