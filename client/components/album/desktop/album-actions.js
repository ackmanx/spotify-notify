import './album-actions.css'
import React from 'react'
import {connect} from 'react-redux'

import {markAlbumAsSeen} from '../../../redux/actions/seen-albums'

export const _DesktopAlbumActions = props => {
    const {album, markAlbumAsSeen, toggleActionsPanel} = props

    return (
        <div className='desktop-album-actions'>
            hi
        </div>
    )
}

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({
    markAlbumAsSeen: albumId => dispatch(markAlbumAsSeen(albumId))
})

export const DesktopAlbumActions = connect(mapStateToProps, mapDispatchToProps)(_DesktopAlbumActions)
