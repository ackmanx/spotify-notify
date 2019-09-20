import './action-bar.less'
import React from 'react'
import {connect} from 'react-redux'

import {ActionButton} from './action-button'
import {getUnseenAlbums} from '../../redux/actions/get-unseen-albums'
import {submitSeenAlbums} from '../../redux/actions/seen-albums'

const _ActionBar = props => {
    const {getUnseenAlbums, seenAlbums, submitSeenAlbums, totalFollowedArtists, totalUnseenAlbums, username} = props

    return (
        <div className='sticky-header'>
            <div className='action-bar'>
                <ActionButton className='refresh-button'
                              imagePath='action-bar/refresh-icon.png'
                              imageAltText='refresh'
                              handler={getUnseenAlbums}/>

                <div className='username'>{username}</div>
                <div>Following: {totalFollowedArtists}</div>
                <div>Unseen: {totalUnseenAlbums}</div>

                <ActionButton className='mark-as-seen-button has-hover'
                              imagePath='action-bar/update-mark-as-seens.png'
                              imageAltText='mark as seen'
                              handler={() => {
                                  const button = document.querySelector('.mark-as-seen-button')
                                  button.classList.remove('has-hover')
                                  button.classList.add('mark-as-seen-button--take-off')
                                  setTimeout(submitSeenAlbums, 500)
                              }}>
                    {seenAlbums.length}
                </ActionButton>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    seenAlbums: state.app.seenAlbums,
    username: state.app.username,
    totalFollowedArtists: state.artists.totalFollowedArtists,
    totalUnseenAlbums: state.artists.totalUnseenAlbums,
})

const mapDispatchToProps = dispatch => ({
    getUnseenAlbums: options => dispatch(getUnseenAlbums(options)),
    submitSeenAlbums: () => dispatch(submitSeenAlbums()),
})

export const ActionBar = connect(mapStateToProps, mapDispatchToProps)(_ActionBar)
