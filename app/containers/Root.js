import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'
import routes from '../config/routes'
import { Router } from 'react-router'
import MainNavContainer from '../components/MainNav'

export default class Root extends Component {
  render() {
    const { store, history } = this.props

    // console.log("store", store)
    return (
      // We wrap our app in a Provider component to pass the store down to the components
      <Provider store={store}>
        <Router history={history} routes={routes} />
      </Provider>
    )
  }
}

Root.propTypes = {
  store: PropTypes.object.isRequired

  // TODO: Deal with hidtory syncing, time travel later
  // history: PropTypes.object.isRequired
}
