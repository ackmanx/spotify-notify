import React, {useEffect, useState} from 'react'
import {connect} from 'react-redux'

import {Banner} from './banner'
import {fetchRefreshStatus} from '../../utils/request-helpers'

const _MessageBanners = ({firstTimeUser, loading, loadingIsRefresh, totalFollowedArtists, totalUnseenAlbums}) => {
    let banner = null

    const [intervalId, setIntervalId] = useState();
    const [current, setCurrent] = useState();
    const [total, setTotal] = useState();
    const [error, setError] = useState(false);

    useEffect(() => {
        if (loadingIsRefresh) {
            const refreshFunction = async () => {
                const {current, total, error} = await fetchRefreshStatus()
                setCurrent(current)
                setTotal(total)
                setError(error)
            }

            refreshFunction()

            setIntervalId(setInterval(refreshFunction, 1000))
        }
        else {
            clearInterval(intervalId)
        }
    }, [loadingIsRefresh])

    if (loading) {
        banner = (
            <div className='loading'>
                <Banner>
                    <p>Loading...</p>
                    {loadingIsRefresh && <>
                        <p>{current} / {total}</p>
                        <p>{error ? 'Oh snap! It broke!' : ''}</p>
                    </>}
                </Banner>
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
    loadingIsRefresh: state.app.loadingIsRefresh,
    totalFollowedArtists: state.artists.totalFollowedArtists,
    totalUnseenAlbums: state.artists.totalUnseenAlbums,
})

const mapDispatchToProps = dispatch => ({})

export const MessageBanners = connect(mapStateToProps, mapDispatchToProps)(_MessageBanners)
