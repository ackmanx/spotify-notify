import './album-actions.css'
import React from 'react'
import {connect} from 'react-redux'
import Modal from 'react-modal'

import {markAlbumAsSeen} from '../../redux/actions/seen-albums'
import {Desktop, Mobile} from '../responsive'

Modal.setAppElement('#root')

export const _AlbumActions = props => {
    const {album, markAlbumAsSeen, toggleActionsPanel} = props

    return (
        <>
            <Mobile>
                <Modal isOpen={true} onRequestClose={toggleActionsPanel} contentLabel="Action Bar">
                    <img src={album.coverArt} alt={album.name}/>
                    <div>{album.artistName}</div>
                    <div>{album.name}</div>
                    <div>{album.releaseDate}</div>
                    <a href={album.spotifyUri}>
                        <img src='album-actions/spotify.png' alt='spotify logo'/> Open in Spotify
                    </a>
                    <button onClick={() => markAlbumAsSeen(album.id)}>
                        <img src='album-actions/ghost.png' alt='mark as seen'/> Mark as Seen
                    </button>
                </Modal>
            </Mobile>
            <Desktop>
                {/* We cannot use onMouseLeave on the album because once the overlay appears, that would trigger the overlay to be removed too, so we have to trigger it on leave of the overlay */}
                <div className='album-actions' onMouseLeave={toggleActionsPanel}>
                    <div className='actions-container'>
                        <a className='action-trigger two-actions' href={album.spotifyUri}>
                            <div className='action-image-container'>
                                <img src='album-actions/spotify.png' alt='spotify logo'/>
                            </div>
                        </a>
                        <a className='action-trigger two-actions' href={album.spotifyWebPlayerUrl} target='_blank'>
                            <div className='action-image-container'>
                                <img src='album-actions/google-chrome.png' alt='spotify logo'/>
                            </div>
                        </a>
                    </div>
                    <div className='actions-container'>
                        <button className='action-trigger one-action' onClick={() => markAlbumAsSeen(album.id)}>
                            <div className='action-image-container'>
                                <img src='album-actions/ghost.png' alt='mark as seen'/>
                            </div>
                        </button>
                    </div>
                </div>
            </Desktop>
        </>
    )
}

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({
    markAlbumAsSeen: albumId => dispatch(markAlbumAsSeen(albumId))
})

export const AlbumActions = connect(mapStateToProps, mapDispatchToProps)(_AlbumActions)
