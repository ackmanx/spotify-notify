import React from 'react'
import Responsive from 'react-responsive'

export const Mobile = props => <Responsive {...props} maxWidth={980}><div>{props.children}</div></Responsive>
export const Desktop = props => <Responsive {...props} minWidth={981}>{props.children}</Responsive>
