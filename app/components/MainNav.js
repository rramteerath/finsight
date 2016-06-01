import React from 'react';
import {connect} from 'react-redux';
import {Map, toJSON} from 'immutable';
import * as actionCreators from '../actions/action_creators';
import Main from './Main'

import './main.sass';

export class MainNav extends React.Component {

  // console.log("children", children)

  render() {
    console.log("props", this.props)
    // console.log("props json", toJSON(this.props))
    //console.log("sel port", this.props.selectedPortfolio.toJSON())
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
            <button onClick={() => this.props.loadTransactions(12)}>Add Trans</button>
          </div>
        </nav>

        {/*}
        <div>
          {children}
        </div>
        */}

        <div>
          <Main {...this.props} />
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  //console.log("mapStateToProps state", state)
  return {
    portfolios: state.get('portfolios'),
    selectedPortfolio: state.get('selectedPortfolio'),
    transactions: state.get('transactions'),
    prices: state.get('prices'),
    tickers: state.get('tickers'),
    transTypes: state.get('transTypes')
  };
}

// http://www.theodo.fr/blog/2016/03/getting-started-with-react-redux-and-immutable-a-test-driven-tutorial-part-2/
// Now, through a call to the connect function in the TodoAppContainer component
// that we already used for fetching the store, we are telling the component to
// map its props callbacks to the action creators of the same name
const MainNavContainer = connect(mapStateToProps, actionCreators)(MainNav);
export default MainNavContainer
