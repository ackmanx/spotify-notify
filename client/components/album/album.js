import './album.less'
import React, {useState} from 'react'
import {bemFactory} from "../../utils/utils";

import {Card} from './desktop/card';
import {AlbumImage} from './album-image'
import {AlbumDetails} from './album-details'
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
                <AlbumImage album={album} onClickHandler={toggleActionsPanel}/>
                {showActions && <Mobile><MobileAlbumActions album={album} toggleActionsPanel={toggleActionsPanel}/></Mobile>}
            </Mobile>

            <AlbumDetails album={album}/>
        </div>
    )
}
