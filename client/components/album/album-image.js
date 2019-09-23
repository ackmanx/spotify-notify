import './album-image.less'
import React from 'react'
import LazyLoad from 'react-lazyload'
import {connect} from "react-redux";
import {bemFactory} from "../../utils/utils";

import {Placeholder} from './placeholder'

const bem = bemFactory('cover-art')

export const _AlbumImage = props => {
    const {album, onClickHandler, seenAlbums} = props

    const isMarked = seenAlbums.includes(album.id) ? 'is-marked' : ''

    return (
        <LazyLoad placeholder={<Placeholder/>}
                  offset={500}
                  once>
            <img className={`${bem()} ${isMarked}`}
                 src={album.coverArt}
                 alt={`${album.artistName} - ${album.name}`}
                 onClick={onClickHandler}/>
        </LazyLoad>
    )
}

const mapStateToProps = state => ({
    seenAlbums: state.app.seenAlbums,
})

const mapDispatchToProps = dispatch => ({})

export const AlbumImage = connect(mapStateToProps, mapDispatchToProps)(_AlbumImage)
