import React from 'react'
import LazyLoad from 'react-lazyload'

import {Placeholder} from './placeholder'

export const AlbumImage = props => {
    const {album, lazyLoad, onClickHandler} = props

    if (lazyLoad) {
        return (
            <LazyLoad placeholder={<Placeholder/>}
                      offset={500}
                      once>
                <img className='album-cover-art'
                     src={album.coverArt}
                     alt={`${album.artistName} - ${album.name}`}
                     onClick={onClickHandler}/>
            </LazyLoad>
        )
    }

    return (
        <img className='album-cover-art'
             src={album.coverArt}
             alt={`${album.artistName} - ${album.name}`}
             onClick={onClickHandler}/>
    )
}
