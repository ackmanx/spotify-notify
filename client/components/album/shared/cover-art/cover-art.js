import './cover-art.less'
import React from 'react'
import LazyLoad from 'react-lazyload'

import { bemFactory } from '../../../../utils/utils'
import { Placeholder } from '../placeholder/placeholder'

const bem = bemFactory('cover-art')

export const CoverArt = (props) => {
    const { album, onClickHandler } = props

    return (
        <LazyLoad placeholder={<Placeholder />} offset={500} once>
            <img
                className={bem()}
                src={album.coverArt}
                alt={`${album.artistName} - ${album.name}`}
                onClick={onClickHandler}
            />
        </LazyLoad>
    )
}
