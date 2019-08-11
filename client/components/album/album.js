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
        <div className={`album ${selected ? 'album-selected' : ''}`}>
            <img className='album-cover-art'
                 src={coverArt}
                 title={artistAlbumName}
                 alt={artistAlbumName}
                 onMouseEnter={toggleOverlay}/>

            {releaseDate}

            {hover && (
                <div className='album-actions-container' onMouseLeave={toggleOverlay}>
                    <a className='spotify-link' href={url} target='_blank'>
                        <div className='overlay-link-container'>
                            <img src='spotify-icon.png' alt='spotify logo'/>
                        </div>
                    </a>
                    <a className='mark-as-seen' href='#' onClick={() => context.markAlbumAsSeen(id)}>
                        <div className='overlay-link-container'>
                            <img src='mark-as-seen.png' alt='mark as seen'/>
                        </div>
                    </a>
                </div>
            )}
        </div>
    )
}
