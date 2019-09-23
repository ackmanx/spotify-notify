import './card.less'
import React, {useState} from 'react'
import {connect} from 'react-redux';

import {AlbumImage} from '../album-image';
import {DesktopAlbumActions} from './album-actions';

export const _Card = props => {
    const {album, seenAlbums} = props
    const isMarked = seenAlbums.includes(album.id)

    const [showActions, setShowActions] = useState(false);

    const toggleActionsPanel = e => {
        //We don't want to flip the card if the user opened a song instead of marking it
        if (e && e.target.tagName === 'A') return
        setShowActions(!showActions)
    }

    return (
        <div className='scene'>
            <div className={`card ${showActions ? 'is-flipped' : ''}`} onClick={toggleActionsPanel}>
                <div className={`card__face card__face--front ${isMarked ? 'is-marked' : ''}`}>
                    <AlbumImage album={album}/>
                </div>
                <div className='card__face card__face--back'>
                    <DesktopAlbumActions album={album} toggleActionsPanel={toggleActionsPanel}/>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    seenAlbums: state.app.seenAlbums,
})

const mapDispatchToProps = dispatch => ({})

export const Card = connect(mapStateToProps, mapDispatchToProps)(_Card)
