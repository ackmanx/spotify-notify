import './action-bar.less'
import React from 'react'
import {connect} from 'react-redux'
import {Desktop} from "../responsive";

import {ActionButton} from './action-button'
import {getUnseenAlbums} from '../../redux/actions/get-unseen-albums'
import {submitSeenAlbums} from '../../redux/actions/seen-albums'
import {bemFactory} from '../../utils/utils'

const bem = bemFactory('action-bar')

const _ActionBar = props => {
    const {getUnseenAlbums, seenAlbums, submitSeenAlbums, totalFollowedArtists, totalUnseenAlbums, username} = props

    return (
        <div className='sticky-header'>
            <div className={bem()}>
                <ActionButton type='submit-seen'
                              imagePath='action-bar/update-mark-as-seens.png'
                              handler={() => {
                                  const button = document.querySelector('.action-button__submit-seen')
                                  button.classList.remove('has-hover')
                                  button.classList.add('action-button__submit-seen--take-off')
                                  setTimeout(submitSeenAlbums, 500)
                              }}>
                    {seenAlbums.length}
                </ActionButton>

                <Desktop>
                    <div className='username'>{username}</div>
                </Desktop>
                <div>Following: {totalFollowedArtists}</div>
                <div>Unseen: {totalUnseenAlbums}</div>

                <ActionButton type='refresh'
                              imagePath='action-bar/refresh-icon.png'
                              handler={getUnseenAlbums}/>
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
