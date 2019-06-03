import './action-bar.css'
import React, { useContext } from 'react'
import {AppContext} from '../../context'

export const ActionBar = () => {
    const {refreshNewAlbums} = useContext(AppContext)

    return (
        <div className='action-bar'>
            <button className='refresh-button' onClick={refreshNewAlbums}>
                <img className='refresh-icon' src="refresh-icon.png" alt='refresh'/>
            </button>
            <button className='mark-as-seen-button'>
                <img className='mark-as-seen-icon' src="update-mark-as-seens.png" alt='mark as seen'/>
                99
            </button>
        </div>
    )
}
