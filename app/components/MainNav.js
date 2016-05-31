import React from 'react';
import {connect} from 'react-redux';
import * as actionCreators from '../actions/action_creators';

import './main.sass';

export class MainNav extends React.Component {

  // console.log("children", children)

  render() {
    console.log("props", this.props)
    const { history, children } = this.props
    return (
      <div className="main-container">
        <nav className="navbar navbar-inverse">
          <div className="container-fluid">
            <div className="navbar-header">
              <a className="navbar-brand app-title" href="/">FinSight</a>
            </div>
            <ul className="nav navbar-nav">
              <li><a href="/#main">Portfolios</a></li>
              <li><a href="/#price">Price</a></li>
            </ul>
            <button onClick={() => this.props.loadTransactions(12)}></button>
          </div>
        </nav>

        <div>
          {children}
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  console.log("mapsStateToProps - state", state)
  return {
    // transactions: state.get('transactions'),
    // prices: state.get('prices')
    transactions: state.transactions,
    prices: state.prices
  };
}

// http://www.theodo.fr/blog/2016/03/getting-started-with-react-redux-and-immutable-a-test-driven-tutorial-part-2/
// Now, through a call to the connect function in the TodoAppContainer component
// that we already used for fetching the store, we are telling the component to
// map its props callbacks to the action creators of the same name
const MainNavContainer = connect(mapStateToProps, actionCreators)(MainNav);
export default MainNavContainer
