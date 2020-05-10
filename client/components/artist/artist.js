import './artist.less'
import React, {useState} from 'react'
import {connect} from 'react-redux'

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
                <div onClick={() => setIsExpanded(!isExpanded)}>
                    {artist.name}
                </div>
                {isExpanded && <img className={bem('select-all')} src='select-all.png' alt='select-all' onClick={() => markArtistAsSeen(artist.id)}/>}
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

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({
    markArtistAsSeen: artistId => dispatch(markArtistAsSeen(artistId))
})

export const Artist = connect(mapStateToProps, mapDispatchToProps)(_Artist)
