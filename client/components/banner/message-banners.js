import React, {useEffect, useState} from 'react'
import {connect} from 'react-redux'

import {Banner} from './banner'
import {fetchRefreshStatus} from '../../utils/request-helpers'

const _MessageBanners = ({firstTimeUser, loading, isRefresh, totalFollowedArtists, totalUnseenAlbums, error}) => {
    let banner = null

    const [intervalId, setIntervalId] = useState();
    const [completed, setCompleted] = useState();
    const [total, setTotal] = useState();

    useEffect(() => {
        //isRefresh is only changed when loading, so we don't need to check for that too
        if (isRefresh) {
            const refreshFunction = async () => {
                const {completed, total} = await fetchRefreshStatus()
                setCompleted(completed)
                setTotal(total)
            }

            //Ignoring returned promise
            refreshFunction()

            setIntervalId(setInterval(refreshFunction, 2000))
        }
        else {
            clearInterval(intervalId)
        }
    }, [isRefresh])

    if (loading) {
        banner = (
            <div className='loading'>
                <Banner>
                    <p>Loading...</p>
                    {isRefresh && <p>{completed} / {total}</p>}
                </Banner>
            </div>
        )
    }
    else {
        if (error) {
            banner = (
                <Banner>
                    <p>The website broke!</p>
                    <p>I don't know what to do now.</p>
                </Banner>
            )
        }
        else if (firstTimeUser) {
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
            banner = <Banner>Nothing new :(</Banner>
        }
    }

    return banner
}


const mapStateToProps = state => ({
    firstTimeUser: state.app.firstTimeUser,
    loading: state.app.loading,
    isRefresh: state.app.isRefresh,
    error: state.app.error,
    totalFollowedArtists: state.artists.totalFollowedArtists,
    totalUnseenAlbums: state.artists.totalUnseenAlbums,
})

const mapDispatchToProps = dispatch => ({})

export const MessageBanners = connect(mapStateToProps, mapDispatchToProps)(_MessageBanners)
