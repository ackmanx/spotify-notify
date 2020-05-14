import './artist.less'
import React, {useState, useEffect, useRef, useCallback} from 'react'
import {connect} from 'react-redux'
import {forceCheck} from "react-lazyload";

import {Album} from '../album/album'
import {markArtistAsSeen} from '../../redux/actions/seen-albums'
import {bemFactory} from '../../utils/utils'

const bem = bemFactory('artist')

const _Artist = props => {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const hasMounted = useRef(false)

    const {artist, markArtistAsSeen} = props

    const albums = artist.albums.filter(album => album.type === 'album')
    const singles = artist.albums.filter(album => album.type === 'single')

    const hasAlbums = !!albums.length
    const hasSingles = !!singles.length

    useEffect(() => {
        if (!hasMounted.current) {
            hasMounted.current = true

            const collapsedArtists = JSON.parse(window.localStorage.getItem('collapsedArtists')) || {}
            const isCollapsed = collapsedArtists[artist.id]

            if (isCollapsed) {
                setIsCollapsed(true)
            }
        }
    }, [isCollapsed, hasMounted, artist, setIsCollapsed])

    const handleCollapse = useCallback(() => {
        setIsCollapsed(!isCollapsed)

        const collapsedArtists = JSON.parse(window.localStorage.getItem('collapsedArtists')) || {}
        collapsedArtists[artist.id] = !isCollapsed
        window.localStorage.setItem('collapsedArtists', JSON.stringify((collapsedArtists)))

        setTimeout(() => forceCheck(), 0)
    }, [artist, isCollapsed, setIsCollapsed])

    if (!hasAlbums && !hasSingles) {
        return null
    }

    return (
        <div className={bem()}>
            <h2 className={bem('name')}>
                <div className={bem('clickable-collapse-panel')} onClick={handleCollapse}/>
                <div className={bem('clickable-mark-all-panel')} onClick={() => markArtistAsSeen(artist.id)}/>
                {artist.name}
            </h2>

            {!isCollapsed && (
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
