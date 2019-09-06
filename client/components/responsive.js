import React from 'react'
import Responsive from 'react-responsive'

export const Mobile = props => <Responsive {...props} maxWidth={500}><div>{props.children}</div></Responsive>
export const Desktop = props => <Responsive {...props} minWidth={501}>{props.children}</Responsive>
