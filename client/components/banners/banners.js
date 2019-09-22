import React, {useEffect, useState} from 'react'
import {connect} from 'react-redux'

const bem = bemFactory('banner')

import {fetchRefreshStatus} from '../../utils/request-helpers'
import {bemFactory} from '../../utils/utils'

const _Banners = ({firstTimeUser, loading, isRefresh, totalFollowedArtists, totalUnseenAlbums, error}) => {
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
            <div className={bem('loading')}>
                <h1>
                    <p>Loading...</p>
                    {isRefresh && <p>{completed} / {total}</p>}
                </h1>
            </div>
        )
    }
    else {
        if (error) {
            banner = (
                <h1>
                    <p>The website broke!</p>
                    <p>I don't know what to do now.</p>
                </h1>
            )
        }
        else if (firstTimeUser) {
            banner = (
                <h1>
                    <p>Looks like you've never been here before.</p>
                    <p> Click the refresh icon to get started!</p>
                </h1>
            )
        }
        else if (!totalFollowedArtists) {
            banner = (
                <h1>
                    <p>Whoa boy, it looks like you aren't following any artists on Spotify!</p>
                    <p>Do that and come back.</p>
                </h1>
            )
        }
        else if (!totalUnseenAlbums) {
            banner = <h1>Nothing new :(</h1>
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

export const Banners = connect(mapStateToProps, mapDispatchToProps)(_Banners)
