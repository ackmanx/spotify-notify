import './action-bar.css'
import React from 'react'

export const ActionBar = () => {
    return (
        <div className='action-bar'>
            <button className='refresh-button'>
                <img className='refresh-icon' src="refresh-icon.png" />
            </button>
        </div>
    )
}
