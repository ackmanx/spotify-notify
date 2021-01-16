import './album-actions.less'
import React from 'react'
import { connect } from 'react-redux'

import {
    addToPlaylist as addToPlaylistAction,
    markAlbumAsSeen as markAlbumAsSeenAction,
} from '../../../redux/actions/seen-albums'
import { bemFactory } from '../../../utils/utils'

const bem = bemFactory('desktop-album-actions')

export const _DesktopAlbumActions = (props) => {
    const { album, addToPlaylist, markAlbumAsSeen, seenAlbums, toggleActionsPanel } = props

    return (
        <div className={bem()}>
            <a className={bem('action')} href={album.spotifyUri}>
                <img src='album-actions/spotify.png' alt='' /> Open in Spotify App
            </a>
            <a className={bem('action')} href={album.spotifyWebPlayerUrl}>
                <img src='album-actions/google-chrome.png' alt='' /> Open in Spotify Web
            </a>
            <button
                className={`${bem('action')} ${bem('button')}`}
                onClick={() => {
                    addToPlaylist(album.id)
                    markAlbumAsSeen(album.id)
                    toggleActionsPanel()
                }}
            >
                <img src='album-actions/smart-plug.png' alt='' /> Add to Playlist
            </button>
            <button
                className={`${bem('action')} ${bem('button')}`}
                onClick={() => {
                    //If we don't delay this, the text will update from Seen to Unseen before the card close animation finishes
                    setTimeout(() => markAlbumAsSeen(album.id), 125)
                    toggleActionsPanel()
                }}
            >
                <img src='album-actions/reaper.png' alt='' />{' '}
                {seenAlbums.includes(album.id) ? 'Mark as Unseen' : 'Mark as Seen'}
            </button>
        </div>
    )
}

const mapStateToProps = (state) => ({
    seenAlbums: state.app.seenAlbums,
})

const mapDispatchToProps = (dispatch) => ({
    addToPlaylist: (albumId) => dispatch(addToPlaylistAction(albumId)),
    markAlbumAsSeen: (albumId) => dispatch(markAlbumAsSeenAction(albumId)),
})

export const DesktopAlbumActions = connect(mapStateToProps, mapDispatchToProps)(_DesktopAlbumActions)
