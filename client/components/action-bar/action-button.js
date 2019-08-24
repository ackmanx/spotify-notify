import './action-bar.css'
import React, {useContext} from 'react'
import {AppContext} from '../../context'

export const ActionButton = ({children, handler, className, imagePath, imageAltText}) => {
    const {loading} = useContext(AppContext)

    return (
        <button className={`action-button ${className ? className : ''} ${loading ? 'disabled' : ''}`} onClick={handler} disabled={loading}>
            <img className='action-icon' src={imagePath} alt={imageAltText}/>
            {children}
        </button>
    )
}
