// es6
import React from 'react'
import {connect} from 'react-redux';
import {Map, toJSON} from 'immutable';
import * as actionCreators from '../actions/action_creators';
import PortfolioList from './Portfolio/PortfolioList'
import PortGrid from './Portfolio/PortGrid'
import MainNavBar from './MainNavBar'
import './main.sass'
import '../styles/globalStyles.sass'

// props passed into Main
// Use object destructuring to change props -> {history, children}
// So const Main = (props) => {...}
// becomes...
export class Main extends React.Component {

	render() {
		return (
			<div className="main-container">
				<MainNavBar />
				<div className="container">
					<div className="well well-sm">
						<span className="header-title">Search by portfolio:</span>
						<PortfolioList
							selectedPortfolio={this.props.selectedPortfolio}
							portfolios={this.props.portfolios}
							loadPortfolios={this.props.loadPortfolios}
							portfolioChanged={(portfolio) => this.props.portfolioChanged(portfolio)}/>
					</div>

					<div>
						<PortGrid {...this.props} />
					</div>
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
    transTypes: state.get('transTypes'),
    period: state.get('period'),
    durationHeld: state.get('durationHeld'),
    reinvCalc: state.get('reinvCalc')
  };
}

// http://www.theodo.fr/blog/2016/03/getting-started-with-react-redux-and-immutable-a-test-driven-tutorial-part-2/
// Now, through a call to the connect function in the TodoAppContainer component
// that we already used for fetching the store, we are telling the component to
// map its props callbacks to the action creators of the same name
const MainContainer = connect(mapStateToProps, actionCreators)(Main);
export default MainContainer
