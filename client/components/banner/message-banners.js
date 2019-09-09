import React from 'react'
import {connect} from 'react-redux'

import {Banner} from './banner'

const _MessageBanners = ({firstTimeUser, loading, totalFollowedArtists, totalUnseenAlbums}) => {
    let banner = null

    if (loading) {
        banner = (
            <div className='loading'>
                <Banner text='Loading...'/>
            </div>
        )
    }
    else {
        if (firstTimeUser) {
            banner = <Banner text="Looks like you've never been here before. Click the refresh icon to get started!"/>
        }
        else if (!totalFollowedArtists) {
            banner = <Banner text="Whoa boy, it looks like you aren't following any artists on Spotify! Do that and come back."/>
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
