import './album.css'
import React, {useState} from 'react'
import {connect} from 'react-redux'

import {AlbumActions} from './mobile/album-actions'
import {AlbumImage} from './album-image'
import {AlbumDetails} from './album-details'

export const _Album = props => {
    const {album, lazyLoad} = props

    const [showActions, setShowActions] = useState(false);

    const toggleActionsPanel = () => setShowActions(!showActions)

    return (
        <div className='album'>
            <AlbumImage album={album} lazyLoad={lazyLoad} onClickHandler={toggleActionsPanel}/>

            <AlbumDetails album={album}/>

            {showActions && <AlbumActions album={album} toggleActionsPanel={toggleActionsPanel}/>}
        </div>
    )
}

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({})

export const Album = connect(mapStateToProps, mapDispatchToProps)(_Album)
