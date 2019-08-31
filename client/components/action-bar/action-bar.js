import './action-bar.css'
import React, { useContext } from 'react'
import {AppContext} from '../../context'
import {ActionButton} from './action-button'

export const ActionBar = () => {
    const {getNewAlbums, seenAlbums, submitSeenAlbums} = useContext(AppContext)

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
