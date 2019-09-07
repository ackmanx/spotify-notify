import './album.css'
import React, {useState} from 'react'
import LazyLoad from 'react-lazyload'
import {connect} from 'react-redux'

import {Placeholder} from './placeholder';
import {Desktop, Mobile} from '../responsive'
import {AlbumActions} from './album-actions'

export const _Album = props => {
    const {album, lazyLoad, seenAlbums} = props

    const [showActions, setShowActions] = useState(false);

    const toggleActionsPanel = () => setShowActions(!showActions)

    const selected = seenAlbums.includes(album.id)

    const albumImage = (
        <>
            <Mobile>
                <img className='album-cover-art'
                     src={album.coverArt}
                     alt={`${album.artistName} - ${album.name}`}
                     onClick={toggleActionsPanel}/>
            </Mobile>
            <Desktop>
                <img className='album-cover-art'
                     src={album.coverArt}
                     alt={`${album.artistName} - ${album.name}`}
                     onMouseEnter={toggleActionsPanel}/>
            </Desktop>
        </>
    )

    return (
        <div className={`album ${selected ? 'album--selected' : ''}`}>
            {lazyLoad && (
                <LazyLoad placeholder={<Placeholder/>}
                          offset={500}
                          once>
                    {albumImage}
                </LazyLoad>
            )}

            {!lazyLoad && albumImage}

            <div className='album-name'>{album.name}</div>
            <div>{album.releaseDate}</div>

            {showActions && <AlbumActions album={album} toggleActionsPanel={toggleActionsPanel}/>}
        </div>
    )
}

const mapStateToProps = state => ({
    seenAlbums: state.app.seenAlbums,
})

const mapDispatchToProps = dispatch => ({})

export const Album = connect(mapStateToProps, mapDispatchToProps)(_Album)
