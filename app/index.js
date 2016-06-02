// import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { browserHistory } from 'react-router'
// import { syncHistoryWithStore } from 'react-router-redux'
import Root from './containers/Root'
import { getInitialState, configureStore } from './store/configureStore'
// import MainNav from './components/MainNav'
import MainNavContainer from './components/MainNav'
import { toJSON } from 'immutable'
import { Provider } from 'react-redux'

const store = configureStore()

// Set intial state
store.dispatch({
  type: 'SET_STATE',
  state: getInitialState()
});

// console.log("store.getState()", store.getState().toJSON())
// const history = syncHistoryWithStore(browserHistory, store)

render(
  <Provider store={store}>
    <MainNavContainer />
  </Provider>,
  document.getElementById('app')
)
