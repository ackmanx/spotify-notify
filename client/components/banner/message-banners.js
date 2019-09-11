import React from 'react'
import {connect} from 'react-redux'

import {Banner} from './banner'

const _MessageBanners = ({firstTimeUser, loading, totalFollowedArtists, totalUnseenAlbums}) => {
    let banner = null

    if (loading) {
        banner = (
            <div className='loading'>
                <Banner>Loading...</Banner>
            </div>
        )
    }
    else {
        if (firstTimeUser) {
            banner = (
                <Banner>
                    <p>Looks like you've never been here before.</p>
                    <p> Click the refresh icon to get started!</p>
                </Banner>
            )
        }
        else if (!totalFollowedArtists) {
            banner = (
                <Banner>
                    <p>Whoa boy, it looks like you aren't following any artists on Spotify!</p>
                    <p>Do that and come back.</p>
                </Banner>
            )
        }
        else if (!totalUnseenAlbums) {
            banner = <Banner text="Nothing new :("/>
        }
    }

    return banner
}


const mapStateToProps = state => ({
    firstTimeUser: state.app.firstTimeUser,
    loading: state.app.loading,
    totalFollowedArtists: state.artists.totalFollowedArtists,
    totalUnseenAlbums: state.artists.totalUnseenAlbums,
})

const mapDispatchToProps = dispatch => ({})

export const MessageBanners = connect(mapStateToProps, mapDispatchToProps)(_MessageBanners)
