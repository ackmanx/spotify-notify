import './album.css'
import React, {useState} from 'react'
import {connect} from 'react-redux'

import {AlbumImage} from './album-image'
import {AlbumDetails} from './album-details'
import {Desktop, Mobile} from '../responsive'
import {DesktopAlbumActions} from './desktop/album-actions'
import {MobileAlbumActions} from './mobile/album-actions'

export const _Album = props => {
    const {album, lazyLoad, seenAlbums} = props

    const [showActions, setShowActions] = useState(false);

    const toggleActionsPanel = () => setShowActions(!showActions)

    const isMarked = seenAlbums.includes(album.id)

    return (
        <div className='album'>

            <Desktop>
                <div className='scene'>
                    <div className={`card ${showActions ? 'is-flipped' : ''}`} onClick={toggleActionsPanel}>
                        <div className={`card__face card__face--front ${isMarked ? 'is-marked' : ''}`}>
                            <AlbumImage album={album} lazyLoad={lazyLoad}/>
                        </div>
                        <div className='card__face card__face--back'>
                            <DesktopAlbumActions album={album}/>
                        </div>
                    </div>
                </div>
            </Desktop>

            <Mobile>
                <AlbumImage album={album} lazyLoad={lazyLoad} onClickHandler={toggleActionsPanel}/>
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
