import React, {useContext} from 'react'
import {connect} from 'react-redux'
import {AppContext} from '../../context'
import {Banner} from './banner'

const MessageBanners = ({firstTimeUser, loading, totalFollowedArtists, totalNewAlbums}) => {
    console.log('###', 'MessageBanners render')

    const context = useContext(AppContext)
    let banner = null

    if (loading) {
        banner = <Banner text='Loading...'/>
    }
    else {
        if (firstTimeUser) {
            banner = <Banner text="Looks like you've never been here before. Click the refresh icon to get started!"/>
        }
        else if (!totalFollowedArtists) {
            banner = <Banner text="Whoa boy, it looks like you aren't following any artists on Spotify! Do that and come back."/>
        }
        else if (!totalNewAlbums) {
            banner = <Banner text="Nothing new :("/>
        }
    }

    return banner
}


const mapStateToProps = state => ({
    firstTimeUser: state.app.firstTimeUser,
    loading: state.app.loading,
    totalFollowedArtists: state.app.totalFollowedArtists,
    totalNewAlbums: state.artists.totalNewAlbums,
})

const mapDispatchToProps = dispatch => ({})

export const ConnectedMessageBanners = connect(mapStateToProps, mapDispatchToProps)(MessageBanners)
