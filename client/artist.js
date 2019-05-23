import React from 'react'
import {AppContext} from './context'

export class Artist extends React.Component {
    render() {
        return (
            <AppContext.Consumer>
                {context =>
                    <div>{this.props.data.name}</div>
                }
            </AppContext.Consumer>
        )
    }
}
