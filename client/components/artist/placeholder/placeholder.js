import './placeholder.less'
import React, {useEffect} from 'react'
import {connect} from 'react-redux'

import {ALL_ALBUMS_IN_VIEWPORT_RENDERED} from '../../../redux/action-types'

//Singleton, not the redux data
let allAlbumsInViewportRendered = false

export const _Placeholder = props => {
    const {dispatchAllAlbumsInViewport, name} = props

    const ref = React.createRef()

    useEffect(() => {
        if (!allAlbumsInViewportRendered) {
            setTimeout(() => {
                //We check for the ref because lazyload may have already destroyed the placeholder element for an artist
                //We also re-check allAlbumsInViewportRendered to short circuit the stack of setTimeouts
                if (ref && ref.current && !allAlbumsInViewportRendered) {
                    const placeholderIsNotInViewport = ref.current.getBoundingClientRect().top > document.documentElement.clientHeight

                    if (placeholderIsNotInViewport) {
                        allAlbumsInViewportRendered = true
                        dispatchAllAlbumsInViewport()
                    }
                }
            }, 0)
        }
    }, [])

    return <div ref={ref} className='artist-placeholder'>{name}</div>
}

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({
    dispatchAllAlbumsInViewport: () => dispatch({type: ALL_ALBUMS_IN_VIEWPORT_RENDERED})
})

export const Placeholder = connect(mapStateToProps, mapDispatchToProps)(_Placeholder)
