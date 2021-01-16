import './album.less'
import React from 'react'

import { bemFactory } from '../../utils/utils'
import { Card } from './shared/card/card'

const bem = bemFactory('album')

export const Album = (props) => {
    const { album } = props

    return (
        <div className={bem()}>
            <Card album={album} />
            <div className={bem('name')}>{album.name}</div>
            <div>{album.releaseDate}</div>
        </div>
    )
}
