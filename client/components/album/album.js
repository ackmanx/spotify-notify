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
                        link
                    </a>
                    <a className='mark-as-seen' href='#' onClick={() => console.log('something')}>
                        mark
                    </a>
                </div>
            )}
        </div>
    )
}
