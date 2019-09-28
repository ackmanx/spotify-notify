import './album.less'
import React, {useState} from 'react'
import {bemFactory} from "../../utils/utils";

import {Card} from './desktop/card';
import {CoverArt} from './shared/cover-art/cover-art'
import {Desktop, Mobile} from '../responsive'
import {MobileAlbumActions} from './mobile/album-actions'

const bem = bemFactory('album')

export const Album = props => {
    const {album} = props

    const [showActions, setShowActions] = useState(false);

    const toggleActionsPanel = e => setShowActions(!showActions)

    return (
        <div className={bem()}>
            <Desktop>
                <Card album={album}/>
            </Desktop>

            <Mobile>
                <CoverArt album={album} onClickHandler={toggleActionsPanel}/>
                {showActions && <MobileAlbumActions album={album} toggleActionsPanel={toggleActionsPanel}/>}
            </Mobile>

            <div className={bem('name')}>{album.name}</div>
            <div>{album.releaseDate}</div>
        </div>
    )
}
