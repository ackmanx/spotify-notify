import './album.css'
import React, {useState} from 'react'
import LazyLoad from 'react-lazyload'
import {connect} from 'react-redux'

import {markAlbumAsSeen} from '../../redux/actions/seen-albums'
import { Placeholder } from './placeholder';

export const _Album = props => {
    console.log('###', 'Album render')

    const {album, artistName, markAlbumAsSeen, seenAlbums} = props

    const artistAlbumName = `${artistName} - ${album.name}`

    const [hover, setHover] = useState(false);

    const toggleOverlay = () => setHover(!hover)

    const selected = seenAlbums.includes(album.id)

    return (
        <div className={`album ${selected ? 'album--selected' : ''}`}>
            <LazyLoad placeholder={<Placeholder/>}
                      offset={500}
                      once>
                <img className='album-cover-art'
                     src={album.coverArt}
                     alt={artistAlbumName}
                     onMouseEnter={toggleOverlay}/>
            </LazyLoad>

            <div className='album-name'>{album.name}</div>
            <div>{album.releaseDate}</div>

            {hover && (
                <div className='album-actions' onMouseLeave={toggleOverlay}>
                    <div className='actions-container'>
                        <a className='action-trigger two-actions' href={album.spotifyUri} target='_blank'>
                            <div className='action-image-container'>
                                <img src='album-actions/spotify.png' alt='spotify logo'/>
                            </div>
                        </a>
                        <a className='action-trigger two-actions' href={album.spotifyWebPlayerUrl} target='_blank'>
                            <div className='action-image-container'>
                                <img src='album-actions/google-chrome.png' alt='spotify logo'/>
                            </div>
                        </a>
                    </div>
                    <div className='actions-container'>
                        <button className='action-trigger one-action' onClick={() => markAlbumAsSeen(album.id)}>
                            <div className='action-image-container'>
                                <img src='album-actions/ghost.png' alt='mark as seen'/>
                            </div>
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

const mapStateToProps = state => ({
    seenAlbums: state.app.seenAlbums,
})

const mapDispatchToProps = dispatch => ({
    markAlbumAsSeen: albumId => dispatch(markAlbumAsSeen(albumId))
})

export const Album = connect(mapStateToProps, mapDispatchToProps)(_Album)
