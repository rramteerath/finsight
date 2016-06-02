// es6
import React from 'react'
import {Map, toJSON} from 'immutable';
import PortfolioList from './Portfolio/PortfolioList'
import PortGrid from './Portfolio/PortGrid'
import Hello from './testts'
import './main.sass'
import '../styles/globalStyles.sass'

// props passed into Main
// Use object destructuring to change props -> {history, children}
// So const Main = (props) => {...}
// becomes...
class Main extends React.Component {
	constructor(props) {
		super(props)

		//console.log("main props", props.selectedPortfolio.toJSON())

		// this.state = {
		// 	currentPortfolio: {}
		//}
	}

	// Create handler to process portfolio change i.e. moving from portfolio to another.
	// handlePortfolioChanged(portfolio) {
	// 	this.setState({ currentPortfolio: portfolio })
	// }

	render() {
		return (
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
					{/*}
					<PortGrid
						selectedPortfolio={this.props.selectedPortfolio}
						transactions={this.props.transactions}
						prices={this.props.prices}
						tickers={this.props.tickers}
						transTypes={this.props.transTypes}
						portfolioChanged={(portfolio) => this.props.portfolioChanged(portfolio)}
					/>
					*/}

          { /* This is how you add a comment to jsx/tsx... jeez */ }
          { /* <Hello /> */ }
				</div>

			</div>
		)
	}
}

export default Main
