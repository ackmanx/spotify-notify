import './album-actions.less'
import React from 'react'
import {connect} from 'react-redux'
import Modal from 'react-modal'

import {markAlbumAsSeen} from '../../../redux/actions/seen-albums'
import {bemFactory} from '../../../utils/utils'

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

const bem = bemFactory('mobile-album-actions')

export const _MobileAlbumActions = props => {
    const {album, markAlbumAsSeen, seenAlbums, toggleActionsPanel} = props

    return (
        <Modal isOpen={true} onRequestClose={toggleActionsPanel} style={modalOverrides}>
            <div className={bem()}>
                <img src='modal-close.png' className={bem('close-button')} alt='' onClick={toggleActionsPanel}/>
                <img className={bem('cover-art')} src={album.coverArt} alt={album.name}/>
                <div className={bem('details')}>
                    <div className={bem('album-name')}>{album.name}</div>
                    <div className={bem('artist-name')}>{album.artistName}</div>
                    <div className={bem('release-date')}>{album.releaseDate}</div>
                </div>
                <div>
                    <div className={bem('action')}>
                        <a className={bem('flex')} href={album.spotifyUri}>
                            <img src='album-actions/spotify.png' alt=''/> Open in Spotify
                        </a>
                    </div>
                    <div className={bem('action')}>
                        <button className={bem('flex')}
                                onClick={() => {
                                    markAlbumAsSeen(album.id);
                                    toggleActionsPanel()
                                }}>
                            <img src='album-actions/ghost.png' alt=''/> {seenAlbums.includes(album.id) ? 'Mark as Unseen' : 'Mark as Seen'}
                        </button>
                    </div>
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
