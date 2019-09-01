import './action-bar.css'
import React from 'react'
import {connect} from 'react-redux'

import {ActionButton} from './action-button'
import {getNewAlbums} from '../../redux/actions/get-new-albums'
import {submitSeenAlbums} from '../../redux/actions/seen-albums'

const _ActionBar = props => {
    const {getNewAlbums, seenAlbums, submitSeenAlbums} = props

    console.log('###', 'ActionBar render')

    return (
        <div className='sticky-header'>
            <div className='action-bar'>
                <ActionButton className='refresh-button'
                              imagePath='refresh-icon.png'
                              imageAltText='refresh'
                              handler={getNewAlbums}/>

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
    seenAlbums: state.app.seenAlbums,
})

const mapDispatchToProps = dispatch => ({
    getNewAlbums: options => dispatch(getNewAlbums(options)),
    submitSeenAlbums: options => dispatch(submitSeenAlbums()),
})

export const ActionBar = connect(mapStateToProps, mapDispatchToProps)(_ActionBar)
