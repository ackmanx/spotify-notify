import './album-actions-mobile.css'
import React from 'react'
import {connect} from 'react-redux'
import Modal from 'react-modal'

import {markAlbumAsSeen} from '../../redux/actions/seen-albums'
import {Mobile} from '../responsive'

Modal.setAppElement('#root')

export const _AlbumActions = props => {
    const {album, markAlbumAsSeen, toggleActionsPanel} = props

    return (
        <>
            <Mobile>
                <Modal isOpen={true} onRequestClose={toggleActionsPanel} contentLabel="Album Actions">
                    <div className='album-actions-mobile'>
                        <img className='album-actions-mobile-album-art' src={album.coverArt} alt={album.name}/>
                        <div className='album-info-mobile'>
                            <div className='album-info-name-mobile'>{album.name}</div>
                            <div className='album-info-artist-name-mobile'>{album.artistName}</div>
                            <div className='album-info-artist-release-date'>{album.releaseDate}</div>
                        </div>
                        <div className='album-action-button'>
                            <a className='album-action-spotify-mobile' href={album.spotifyUri}>
                                <img src='album-actions/spotify.png' alt='spotify logo'/> Open in Spotify
                            </a>
                        </div>
                        <div className='album-action-button'>
                            <button className='album-action-mark-as-seen-mobile' onClick={() => {markAlbumAsSeen(album.id); toggleActionsPanel()}}>
                                <img src='album-actions/ghost.png' alt='mark as seen'/> Mark as Seen
                            </button>
                        </div>
                    </div>
                </Modal>
            </Mobile>
        </>
    )
}

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({
    markAlbumAsSeen: albumId => dispatch(markAlbumAsSeen(albumId))
})

export const AlbumActions = connect(mapStateToProps, mapDispatchToProps)(_AlbumActions)
