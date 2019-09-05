import './reset.css'
import './index.css'
import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {applyMiddleware, combineReducers, createStore} from 'redux'
import {composeWithDevTools} from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import {App} from './app'
import {app} from './redux/reducers/app'
import {artists} from './redux/reducers/artists'

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
