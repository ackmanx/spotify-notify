import './card.less'
import React, {useState} from 'react'
import {connect} from 'react-redux';

import {CoverArt} from '../shared/cover-art/cover-art';
import {DesktopAlbumActions} from './album-actions';
import {Desktop, Mobile} from '../../responsive'
import {MobileAlbumActions} from '../mobile/album-actions'

export const _Card = props => {
    const {album, seenAlbums} = props

    const [showActions, setShowActions] = useState(false);
    const isMarked = seenAlbums.includes(album.id) ? 'is-marked' : ''

    const toggleActionsPanel = e => {
        //We don't want to flip the card if the user opened a song instead of marking it
        if (e && e.target.tagName === 'A') return
        setShowActions(!showActions)
    }

    return <>
        <Desktop>
            <div className='scene'>
                <div className={`card ${showActions ? 'is-flipped' : ''}`} onClick={toggleActionsPanel}>
                    <div className={`card__face card__face--front ${isMarked ? 'is-marked' : ''}`}>
                        <CoverArt album={album}/>
                    </div>
                    <div className='card__face card__face--back'>
                        <DesktopAlbumActions album={album} toggleActionsPanel={toggleActionsPanel}/>
                    </div>
                </div>
            </div>
        </Desktop>
        <Mobile>
            <div className={isMarked ? 'is-marked' : ''}>
                <CoverArt album={album} onClickHandler={toggleActionsPanel}/>
            </div>
            {showActions && <MobileAlbumActions album={album} toggleActionsPanel={toggleActionsPanel}/>}
        </Mobile>
    </>
}

const mapStateToProps = state => ({
    seenAlbums: state.app.seenAlbums,
})

const mapDispatchToProps = dispatch => ({})

export const Card = connect(mapStateToProps, mapDispatchToProps)(_Card)
