import './meta-menu.less'
import React, {useState} from 'react'
import {connect} from 'react-redux'

import {bemFactory} from '../../utils/utils'

const bem = bemFactory('meta-menu')

const _MetaMenu = props => {
    const {seenAlbums, totalFollowedArtists, totalUnseenAlbums, username} = props
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const handleMenuOpen = () => setIsMenuOpen(!isMenuOpen)

    return (
        <div className={bem()}>
            <div className={bem('username')} onClick={handleMenuOpen}>{username}</div>
            {isMenuOpen && (
                <div className={bem('menu')}>
                    <div>Following: {totalFollowedArtists}</div>
                    <div>Seen: {seenAlbums}</div>
                    <div>Unseen: {totalUnseenAlbums}</div>
                </div>
            )}
        </div>
    )
}

const mapStateToProps = state => ({
    seenAlbums: state.app.seenAlbums,
    totalFollowedArtists: state.artists.totalFollowedArtists,
    totalUnseenAlbums: state.artists.totalUnseenAlbums,
    username: state.app.username,
})

const mapDispatchToProps = dispatch => ({})

export const MetaMenu = connect(mapStateToProps, mapDispatchToProps)(_MetaMenu)
