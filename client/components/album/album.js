import './album.less'
import React, {useState} from 'react'
import {connect} from 'react-redux'
import {bemFactory} from "../../utils/utils";

import {Card} from './desktop/card';
import {AlbumImage} from './album-image'
import {AlbumDetails} from './album-details'
import {Desktop, Mobile} from '../responsive'
import {MobileAlbumActions} from './mobile/album-actions'

const bem = bemFactory('album')

export const _Album = props => {
    const {album, seenAlbums} = props
    const isMarked = seenAlbums.includes(album.id)

    const [showActions, setShowActions] = useState(false);

    const toggleActionsPanel = e => setShowActions(!showActions)

    return (
        <div className={bem()}>
            <Desktop>
                <Card album={album}/>
            </Desktop>

            <Mobile>
                <AlbumImage addClass={isMarked ? 'is-marked' : ''} album={album} onClickHandler={toggleActionsPanel}/>
                {showActions && <Mobile><MobileAlbumActions album={album} toggleActionsPanel={toggleActionsPanel}/></Mobile>}
            </Mobile>

            <AlbumDetails album={album}/>
        </div>
    )
}

const mapStateToProps = state => ({
    seenAlbums: state.app.seenAlbums,
})

const mapDispatchToProps = dispatch => ({})

export const Album = connect(mapStateToProps, mapDispatchToProps)(_Album)
