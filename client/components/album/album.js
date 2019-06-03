import './album.css'
import React, {useState} from 'react'

export const Album = ({album: {id, name, url, coverArt}, artist}) => {
    const artistAlbumName = `${artist} - ${name}`

    const [hover, setHover] = useState(false);

    const toggleOverlay = () => setHover(!hover)

    return (
        <div className='album'>
            <img className='album-cover-art'
                 src={coverArt}
                 title={artistAlbumName}
                 alt={artistAlbumName}
                 onMouseEnter={toggleOverlay}/>

            {hover && (
                <div className='album-overlay' onMouseLeave={toggleOverlay}>
                    <a className='spotify-link' href={url} target='_blank'>
                        <div className='overlay-link-container'>
                            <img src='spotify-icon.png' alt='spotify logo'/>
                        </div>
                    </a>
                    <a className='mark-as-seen' href='#' onClick={() => console.log('something')}>
                        <div className='overlay-link-container'>
                            <img src='mark-as-seen.png' alt='mark as seen'/>
                        </div>
                    </a>
                </div>
            )}
        </div>
    )
}
