import './card.less'
import React, {useState} from 'react'
import {connect} from 'react-redux';

import {CoverArt} from '../cover-art/cover-art';
import {DesktopAlbumActions} from '../../desktop/album-actions';
import {MobileAlbumActions} from '../../mobile/album-actions'
import {Desktop, Mobile} from '../../../responsive'
import {bemFactory} from '../../../../utils/utils'

const bem = bemFactory('card-container')

/*
 * This component handles the desktop Card, which is like a playing card you can flip with actions on the backside
 * It handles the mobile Card, which brings up a modal after clicking it to show the actions
 */
export const _Card = props => {
    const {album, seenAlbums} = props

    const [showActions, setShowActions] = useState(false);
    const isMarked = seenAlbums.includes(album.id) ? 'is-marked' : ''

    const toggleActionsPanel = e => {
        //We don't want to flip the card if the user opened a song instead of marking it
        if (e && e.target.tagName === 'A') return
        setShowActions(!showActions)
    }

    return (
        <div className={bem()}>
            <Desktop>
                <div className={bem('scene')}>
                    <div className={`${bem('card')} ${showActions ? 'is-flipped' : ''}`} onClick={toggleActionsPanel}>
                        <div className={`${bem('card-face')} ${bem('card-face--front')} ${isMarked ? bem('is-marked') : ''}`}>
                            <CoverArt album={album}/>
                        </div>
                        <div className={`${bem('card-face')} ${bem('card-face--back')}`}>
                            <DesktopAlbumActions album={album} toggleActionsPanel={toggleActionsPanel}/>
                        </div>
                    </div>
                </div>
            </Desktop>
            <Mobile>
                <div className={isMarked ? bem('is-marked') : ''}>
                    <CoverArt album={album} onClickHandler={toggleActionsPanel}/>
                </div>
                {showActions && <MobileAlbumActions album={album} toggleActionsPanel={toggleActionsPanel}/>}
            </Mobile>
        </div>
    )
}

const mapStateToProps = state => ({
    seenAlbums: state.app.seenAlbums,
})

const mapDispatchToProps = dispatch => ({})

export const Card = connect(mapStateToProps, mapDispatchToProps)(_Card)
