import './album-actions.less'
import React from 'react'
import {connect} from 'react-redux'
import Modal from 'react-modal'

import {markAlbumAsSeen} from '../../../redux/actions/seen-albums'

Modal.setAppElement('#root')

const modalOverrides = {
    content: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        border: 'none',
        borderRadius: 0,
    }
}

export const _MobileAlbumActions = props => {
    const {album, markAlbumAsSeen, seenAlbums, toggleActionsPanel} = props

    return (
        <Modal isOpen={true} onRequestClose={toggleActionsPanel} style={modalOverrides}>
            <div className='album-actions-mobile'>
                <button className='close-button' onClick={toggleActionsPanel}>X</button>
                <img className='album-actions-mobile-album-art' src={album.coverArt} alt={album.name}/>
                <div className='album-info-mobile'>
                    <div className='album-info-name-mobile'>{album.name}</div>
                    <div className='album-info-artist-name-mobile'>{album.artistName}</div>
                    <div className='album-info-artist-release-date'>{album.releaseDate}</div>
                </div>
                <div className='album-action-button'>
                    <a className='album-action-spotify-mobile' href={album.spotifyUri}>
                        <img src='album-actions/spotify.png' alt=''/> Open in Spotify
                    </a>
                </div>
                <div className='album-action-button'>
                    <button className='album-action-mark-as-seen-mobile' onClick={() => {
                        markAlbumAsSeen(album.id);
                        toggleActionsPanel()
                    }}>
                        <img src='album-actions/ghost.png' alt=''/> {seenAlbums.includes(album.id) ? 'Mark as Unseen' : 'Mark as Seen'}
                    </button>
                </div>
            </div>
        </Modal>
    )
}

const mapStateToProps = state => ({
    seenAlbums: state.app.seenAlbums,
})

const mapDispatchToProps = dispatch => ({
    markAlbumAsSeen: albumId => dispatch(markAlbumAsSeen(albumId))
})

export const MobileAlbumActions = connect(mapStateToProps, mapDispatchToProps)(_MobileAlbumActions)
