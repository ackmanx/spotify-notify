import './action-bar.css'
import React, { useContext } from 'react'
import {AppContext} from '../../context'

export const ActionBar = () => {
    const {loading, refreshNewAlbums, seenAlbums, submitSeenAlbums} = useContext(AppContext)

    return (
        <div className='action-bar'>
            <button className={`action-button refresh-button ${loading ? 'disabled' : ''}`} onClick={refreshNewAlbums} disabled={loading}>
                <img className='action-icon' src="refresh-icon.png" alt='refresh'/>
            </button>
            <button className={`action-button mark-as-seen-button ${loading ? 'disabled' : ''}`} onClick={submitSeenAlbums} disabled={loading}>
                <img className='action-icon' src="update-mark-as-seens.png" alt='mark as seen'/>
                {seenAlbums.length}
            </button>
        </div>
    )
}
