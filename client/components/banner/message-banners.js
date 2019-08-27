import React, {useContext} from 'react'
import {AppContext} from '../../context'
import {Banner} from './banner'

export const MessageBanners = () => {
    const context = useContext(AppContext)
    let banner = null

    if (context.loading) {
        banner = <Banner text='Loading...'/>
    }
    else {
        if (context.firstTimeUser) {
            banner = <Banner text="Looks like you've never been here before. Click the refresh icon to get started!"/>
        }
        else if (!context.totalFollowedArtists) {
            banner = <Banner text="Whoa boy, it looks like you aren't following any artists on Spotify! Do that and come back."/>
        }
        else if (!context.totalNewAlbums) {
            banner = <Banner text="Nothing new :("/>
        }
    }

    return banner
}
