import './album-actions.css'
import React from 'react'
import {connect} from 'react-redux'

import {markAlbumAsSeen} from '../../../redux/actions/seen-albums'

export const _DesktopAlbumActions = props => {
    const {album, markAlbumAsSeen, toggleActionsPanel} = props

    return (
        <div className='desktop-album-actions'>
            <div className='desktop-album-actions-2'>
                <div className='desktop-actions-container'>
                    <a className='desktop-album-action-button desktop-album-action-spotify' href={album.spotifyUri}>
                        <img src='album-actions/spotify.png' alt=''/> Open in Spotify App
                    </a>
                    <a className='desktop-album-action-button desktop-album-action-spotify' href={album.spotifyWebPlayerUrl}>
                        <img src='album-actions/google-chrome.png' alt=''/> Open in Spotify Web
                    </a>
                    <button className='desktop-album-action-button desktop-album-action-mark-as-seen' onClick={() => {
                        markAlbumAsSeen(album.id);
                        toggleActionsPanel()
                    }}>
                        <img src='album-actions/ghost.png' alt=''/> Toggle Seen/Unseen
                    </button>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({
    markAlbumAsSeen: albumId => dispatch(markAlbumAsSeen(albumId))
})

export const DesktopAlbumActions = connect(mapStateToProps, mapDispatchToProps)(_DesktopAlbumActions)
