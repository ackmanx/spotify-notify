import React from 'react'
import {AppContext} from './context'

export class Artist extends React.Component {
    render() {
        return (
            <AppContext.Consumer>
                {context =>
                    <h1>hello context</h1>
                }
            </AppContext.Consumer>
        )
    }
}
