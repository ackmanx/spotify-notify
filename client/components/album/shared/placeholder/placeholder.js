import './placeholder.less'
import React from 'react'

import {bemFactory} from '../../../../utils/utils'

const bem = bemFactory('album-placeholder')

export const Placeholder = () => (
    <div className={bem()}/>
)
