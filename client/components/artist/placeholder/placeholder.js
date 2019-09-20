import './placeholder.less'
import React, {useEffect} from 'react'
import {connect} from 'react-redux'

import {ALL_ALBUMS_IN_VIEWPORT_RENDERED} from '../../../redux/action-types'

//Singleton, not the redux data
let allAlbumsInViewportRendered = false

export const _Placeholder = props => {
    const {dispatchAllAlbumsInViewport, name} = props

    const ref = React.createRef()

    //As each placeholder is rendered for the artists, we check to see if it's in the viewport
    //We wait until we find an artist that isn't in the viewport, so we can set the trigger to have react-lazyload force recheck for loading
    //This allows us to correctly time when to do the force recheck, taking into account network and device speeds
    useEffect(() => {
        if (!allAlbumsInViewportRendered) {
            //We check for the ref because lazyload may have already destroyed the placeholder element for an artist
            if (ref && ref.current) {
                const placeholderIsNotInViewport = ref.current.getBoundingClientRect().top > document.documentElement.clientHeight

                if (placeholderIsNotInViewport) {
                    allAlbumsInViewportRendered = true
                    dispatchAllAlbumsInViewport()
                }
            }
        }
    }, [])

    return <div ref={ref} className='artist-placeholder'>{name}</div>
}

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({
    dispatchAllAlbumsInViewport: () => dispatch({type: ALL_ALBUMS_IN_VIEWPORT_RENDERED})
})

export const Placeholder = connect(mapStateToProps, mapDispatchToProps)(_Placeholder)
