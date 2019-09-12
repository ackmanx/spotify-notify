import './album-image.css'
import React from 'react'
import LazyLoad from 'react-lazyload'

import {Placeholder} from './placeholder'

export const AlbumImage = props => {
    const {addClass, album, lazyLoad, onClickHandler} = props
    let className = 'album-cover-art'

    if (addClass) {
        className = `${className} ${addClass}`
    }

    if (lazyLoad) {
        return (
            <LazyLoad placeholder={<Placeholder/>}
                      offset={500}
                      once>
                <img className={className}
                     src={album.coverArt}
                     alt={`${album.artistName} - ${album.name}`}
                     onClick={onClickHandler}/>
            </LazyLoad>
        )
    }

    return (
        <img className={className}
             src={album.coverArt}
             alt={`${album.artistName} - ${album.name}`}
             onClick={onClickHandler}/>
    )
}
