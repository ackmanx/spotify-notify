import './album.css'
import React, {useContext, useState} from 'react'
import {AppContext} from '../../context'

export const Album = ({album: {id, name, url, coverArt, releaseDate}, artist}) => {
    const context = useContext(AppContext)
    const artistAlbumName = `${artist} - ${name}`

    const [hover, setHover] = useState(false);

    const toggleOverlay = () => setHover(!hover)

    const selected = context.seenAlbums.includes(id)

    return (
        <div className={`album ${selected ? 'album--selected' : ''}`}>
            <img className='album-cover-art'
                 src={coverArt}
                 title={artistAlbumName}
                 alt={artistAlbumName}
                 onMouseEnter={toggleOverlay}/>

            {releaseDate}

            {hover && (
                <div className='album-actions' onMouseLeave={toggleOverlay}>
                    <div className='actions-container'>
                        <a className='action-trigger two-actions' href={url} target='_blank'>
                            <div className='action-image-container'>
                                <img src='spotify-icon.png' alt='spotify logo'/>
                            </div>
                        </a>
                        <a className='action-trigger two-actions' href={url} target='_blank'>
                            <div className='action-image-container'>
                                <img src='spotify-icon.png' alt='spotify logo'/>
                            </div>
                        </a>
                    </div>
                    <div className='actions-container'>
                        <a className='action-trigger one-action' href='#' onClick={() => context.markAlbumAsSeen(id)}>
                            <div className='action-image-container'>
                                <img src='mark-as-seen.png' alt='mark as seen'/>
                            </div>
                        </a>
                    </div>
                </div>
            )}
        </div>
    )
}
