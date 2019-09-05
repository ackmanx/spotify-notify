import './action-bar.css'
import React from 'react'
import {connect} from 'react-redux'

import {ActionButton} from './action-button'
import {getNewAlbums} from '../../redux/actions/get-new-albums'
import {submitSeenAlbums} from '../../redux/actions/seen-albums'

const _ActionBar = props => {
    const {getNewAlbums, loading, seenAlbums, submitSeenAlbums, totalFollowedArtists, totalNewAlbums, username} = props

    return (
        <div className='sticky-header'>
            <div className='action-bar'>
                <ActionButton className='refresh-button'
                              imagePath='refresh-icon.png'
                              imageAltText='refresh'
                              handler={getNewAlbums}/>

                {!loading && <>
                    <div className='username'>{username}</div>
                    <div>Following: {totalFollowedArtists}</div>
                    <div>Unseen: {totalNewAlbums}</div>
                </>}

                <ActionButton className='mark-as-seen-button'
                              imagePath='update-mark-as-seens.png'
                              imageAltText='mark as seen'
                              handler={submitSeenAlbums}>
                    {seenAlbums.length}
                </ActionButton>
            </div>
        </div>
    )
}


const mapStateToProps = state => ({
    loading: state.app.loading,
    seenAlbums: state.app.seenAlbums,
    username: state.app.username,
    totalFollowedArtists: state.artists.totalFollowedArtists,
    totalNewAlbums: state.artists.totalNewAlbums,
})

const mapDispatchToProps = dispatch => ({
    getNewAlbums: options => dispatch(getNewAlbums(options)),
    submitSeenAlbums: options => dispatch(submitSeenAlbums()),
})

export const ActionBar = connect(mapStateToProps, mapDispatchToProps)(_ActionBar)
