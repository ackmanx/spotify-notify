import './meta-menu.less'
import React, {useState} from 'react'
import {connect} from 'react-redux'
import {useTransition, animated} from "react-spring";

import {bemFactory} from '../../utils/utils'

const bem = bemFactory('meta-menu')

const _MetaMenu = props => {
    const {seenAlbums, totalFollowedArtists, totalUnseenAlbums, username} = props
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    //say what this does
    const transitions = useTransition(isMenuOpen, null, {
        from: {height: '0px', opacity: 0}, //describe the height
        enter: {opacity: 1},
        leave: {opacity: 0},
    })

    const handleMenuOpen = () => setIsMenuOpen(!isMenuOpen)

    return (
        <div className={bem()}>
            <div className={bem('username')} onClick={handleMenuOpen}>{username}</div>
            {transitions.map(({item, key, props}) => //describe how this works above at the hook
                item && (
                    <animated.div key={key} style={props}>
                        <div className={bem('menu')}>
                            <div>Following: {totalFollowedArtists}</div>
                            <div>Seen: {seenAlbums}</div>
                            <div>Unseen: {totalUnseenAlbums}</div>
                        </div>
                    ️</animated.div>
                )
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
