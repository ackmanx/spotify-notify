import './action-button.less'
import React from 'react'
import {connect} from 'react-redux'
import {bemFactory} from '../../utils/utils'

const bem = bemFactory('action-button')

const _ActionButton = props => {
    const {children, handler, imagePath, imageAltText, loading, type} = props
    let className = ''

    if (type === 'refresh')
        className = bem('refresh')
    else if (type === 'submit-seen')
        className = `${bem('submit-seen')} has-hover`

    return (
        <button className={`${bem()} ${className}`} onClick={handler} disabled={loading}>
            <img className={bem('action-icon')} src={imagePath}/>
            {children}
        </button>
    )
}

const mapStateToProps = state => ({
    loading: state.app.loading,
})

export const ActionButton = connect(mapStateToProps)(_ActionButton)
