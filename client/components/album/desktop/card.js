import './card.less'
import React, {useState} from 'react'
import {connect} from 'react-redux';

import {CoverArt} from '../shared/cover-art/cover-art';
import {DesktopAlbumActions} from './album-actions';

export const Card = props => {
    const {album} = props

    const [showActions, setShowActions] = useState(false);

    const toggleActionsPanel = e => {
        //We don't want to flip the card if the user opened a song instead of marking it
        if (e && e.target.tagName === 'A') return
        setShowActions(!showActions)
    }

    return (
        <div className='scene'>
            <div className={`card ${showActions ? 'is-flipped' : ''}`} onClick={toggleActionsPanel}>
                <div className='card__face card__face--front'>
                    <CoverArt album={album}/>
                </div>
                <div className='card__face card__face--back'>
                    <DesktopAlbumActions album={album} toggleActionsPanel={toggleActionsPanel}/>
                </div>
            </div>
        </div>
    )
}
