import './action-bar.css'
import React from 'react'
import {connect} from 'react-redux'

const _ActionButton = props => {
    const {children, handler, className, imagePath, imageAltText, loading} = props

    return (
        <button className={`action-button ${className ? className : ''}`} onClick={handler} disabled={loading}>
            <img className='action-icon' src={imagePath} alt={imageAltText}/>
            {children}
        </button>
    )
}

const mapStateToProps = state => ({
    loading: state.app.loading,
})

export const ActionButton = connect(mapStateToProps)(_ActionButton)
