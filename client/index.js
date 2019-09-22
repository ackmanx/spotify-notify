import 'normalize.css'
import './styles/global.less'
import './styles/modal-overrides.less'
import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {applyMiddleware, combineReducers, createStore} from 'redux'
import {composeWithDevTools} from 'redux-devtools-extension'
import thunk from 'redux-thunk'

import {App} from './app'
import {app} from './redux/reducers/app-reducer'
import {artists} from './redux/reducers/artists-reducer'

const store = createStore(
    combineReducers({
        app,
        artists,
    }),
    composeWithDevTools(
        applyMiddleware(thunk),
    )
)

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root')
)
