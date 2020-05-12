import './artist.less'
import React, {useState} from 'react'
import {connect} from 'react-redux'
import {forceCheck} from "react-lazyload";

import {Album} from '../album/album'
import {markArtistAsSeen} from '../../redux/actions/seen-albums'
import {bemFactory} from '../../utils/utils'

const bem = bemFactory('artist')

const _Artist = props => {
    const [isExpanded, setIsExpanded] = useState(true)

    const {artist, markArtistAsSeen} = props

    const albums = artist.albums.filter(album => album.type === 'album')
    const singles = artist.albums.filter(album => album.type === 'single')

    const hasAlbums = !!albums.length
    const hasSingles = !!singles.length

    if (!hasAlbums && !hasSingles) {
        return null
    }

    return (
        <div className={bem()}>
            <h2 className={bem('name')}>
                <div className={bem('clickable-collapse-panel')} onClick={() => {
                    setIsExpanded(!isExpanded)
                    setTimeout(() => forceCheck(), 0)
                }}/>
                <div className={bem('clickable-mark-all-panel')} onClick={() => markArtistAsSeen(artist.id)}/>
                {artist.name}
            </h2>

            {isExpanded && (
                <>
                    {hasAlbums && <>
                        <h3 className={bem('album-group')}>Albums</h3>
                        {albums.map(album => <Album key={album.id} album={album}/>)}
                    </>}

                    {hasSingles && <>
                        <h3 className={bem('album-group')}>Singles</h3>
                        {singles.map(single => <Album key={single.id} album={single}/>)}
                    </>}
                </>
            )}
        </div>
    )
}

const mapDispatchToProps = dispatch => ({
    markArtistAsSeen: artistId => dispatch(markArtistAsSeen(artistId))
})

export const Artist = connect(undefined, mapDispatchToProps)(_Artist)
