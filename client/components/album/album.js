import './album.css'
import React, {useContext, useState} from 'react'
import {AppContext} from '../../context'

export const Album = ({album, artistName}) => {
    const context = useContext(AppContext)
    const artistAlbumName = `${artistName} - ${album.name}`

    const [hover, setHover] = useState(false);

    const toggleOverlay = () => setHover(!hover)

    const selected = context.seenAlbums.includes(album.id)

    return (
        <div className={`album ${selected ? 'album--selected' : ''}`}>
            <img className='album-cover-art'
                 src={album.coverArt}
                 title={artistAlbumName}
                 alt={artistAlbumName}
                 onMouseEnter={toggleOverlay}/>

            {album.releaseDate}

            {hover && (
                <div className='album-actions' onMouseLeave={toggleOverlay}>
                    <div className='actions-container'>
                        <a className='action-trigger two-actions' href={album.spotifyUri} target='_blank'>
                            <div className='action-image-container'>
                                <img src='spotify-icon.png' alt='spotify logo'/>
                            </div>
                        </a>
                        <a className='action-trigger two-actions' href={album.spotifyWebPlayerUrl} target='_blank'>
                            <div className='action-image-container'>
                                <img src='google-chrome-icon.png' alt='spotify logo'/>
                            </div>
                        </a>
                    </div>
                    <div className='actions-container'>
                        <button className='action-trigger one-action' onClick={() => context.markAlbumAsSeen(album.id)}>
                            <div className='action-image-container'>
                                <img src='mark-as-seen.png' alt='mark as seen'/>
                            </div>
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
