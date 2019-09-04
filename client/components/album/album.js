import './album.css'
import React, {useState} from 'react'
import LazyLoad from 'react-lazyload'
import {connect} from 'react-redux'

import {Placeholder} from './placeholder';
import {Desktop, Mobile} from '../responsive'
import {AlbumActions} from './album-actions'

export const _Album = props => {
    const {album, artistName, lazyLoad, seenAlbums} = props

    const artistAlbumName = `${artistName} - ${album.name}`

    const [showActions, setShowActions] = useState(false);

    const toggleActionsPanel = () => setShowActions(!showActions)

    const selected = seenAlbums.includes(album.id)

    const renderOutput = (
        <>
            <Mobile>
                <img className='album-cover-art'
                     src={album.coverArt}
                     alt={artistAlbumName}
                     onClick={toggleActionsPanel}/>
            </Mobile>
            <Desktop>
                <img className='album-cover-art'
                     src={album.coverArt}
                     alt={artistAlbumName}
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
                    {renderOutput}
                </LazyLoad>
            )}

            {!lazyLoad && renderOutput}

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
