// import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import {Router, Route, hashHistory} from 'react-router';
// import { syncHistoryWithStore } from 'react-router-redux'
import Root from './containers/Root'
import { getInitialState, configureStore } from './store/configureStore'
// import MainNav from './components/MainNav'
import MainContainer from './components/Main'
import PriceEntryContainer from './components/Price/PriceEntry'
import { toJSON } from 'immutable'
import { Provider } from 'react-redux'
// import routes from './config/routes'
import App from './App';

const store = configureStore()

const routes = <Route component={App}>
  <Route path="/" component={MainContainer} />
  <Route path="/main" component={MainContainer} />
  <Route path="/price" component={PriceEntryContainer} />
</Route>;

// Set intial state
store.dispatch({
  type: 'SET_STATE',
  state: getInitialState()
});

// console.log("store.getState()", store.getState().toJSON())
// const history = syncHistoryWithStore(browserHistory, store)

render(
  <Provider store={store}>
    <Router history={hashHistory}>{routes}</Router>
  </Provider>,
  document.getElementById('app')

// render(
//   <Provider store={store}>
//     <MainNavBar />
//   </Provider>,
//   document.getElementById('app')

)
