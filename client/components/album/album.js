import './album.css'
import { Placeholder } from './placeholder';
import React, {useContext, useState} from 'react'
import LazyLoad from 'react-lazyload'
import {AppContext} from '../../context'

export const Album = ({album, artistName}) => {
    console.log('###', 'Album render')

    const context = useContext(AppContext)
    const artistAlbumName = `${artistName} - ${album.name}`

    const [hover, setHover] = useState(false);

    const toggleOverlay = () => setHover(!hover)

    const selected = context.seenAlbums.includes(album.id)

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
                        <button className='action-trigger one-action' onClick={() => context.markAlbumAsSeen(album.id)}>
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
