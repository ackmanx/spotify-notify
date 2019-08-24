import './action-bar.css'
import React, { useContext } from 'react'
import {AppContext} from '../../context'
import {ActionButton} from './action-button'

export const ActionBar = () => {
    const {refreshNewAlbums, seenAlbums, submitSeenAlbums} = useContext(AppContext)

    return (
        <div className='action-bar'>
            <ActionButton className='refresh-button'
                          imagePath='refresh-icon.png'
                          imageAltText='refresh'
                          handler={refreshNewAlbums}/>

            <ActionButton className='mark-as-seen-button'
                          imagePath='update-mark-as-seens.png'
                          imageAltText='mark as seen'
                          handler={submitSeenAlbums}>
                {seenAlbums.length}
            </ActionButton>
        </div>
    )
}
