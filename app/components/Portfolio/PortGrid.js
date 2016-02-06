import React from 'react'
import * as portModel from '../../models/portfolioModel'
import TransEdit from '../Transaction/TransEdit'
import Griddle from 'griddle-react'

class PortGrid extends React.Component {
	// With es6, the getInitialState is replaced by the constructor.
	constructor(props) {
		super(props);

		this.state = {
			transactions: []
		}
	}

	// componentDidMount lifecycle event called after the component mounts the view
	componentDidMount() {
		this.init(this.props);
	}

	// Receive props when they change
	componentWillReceiveProps(nextProps) {
		if (nextProps.currentPortfolio.id)
			this.getTransactions(nextProps.currentPortfolio)
	}

	componentWillUnmount() {
		console.log(this.state);
	}

	init(props) {
		if (this.props.currentPortfolio.id)
			this.getTransactions(this.props.currentPortfolio)
	}

	getTransactions(portfolio) {
		portModel.getPortfolioTransactions(portfolio.id)
			.then((response) => {
				this.setState({transactions: response})
			})
	}

	// Called when the transactions in the current portfolio have been updated, added, deleted.
	handleTransactionsChanged(portfolio) {
		this.getTransactions(this.props.currentPortfolio)
	}

	render() {
		return (
			<div>
				<div className="container">
					<Griddle results={this.state.transactions} tableClassName="table" showFilter={false}
	 				showSettings={true} columns={["executionDate", "transType", "ticker", "quantity", "price", "commission"]}/>
				</div>

				<div className="container">
					<TransEdit 
						currentPortfolio={this.props.currentPortfolio}
						transactionsChanged={() => this.handleTransactionsChanged()} />
				</div>
			</div>
		)
	}
}

PortGrid.propTypes = {
	currentPortfolio: React.PropTypes.object.isRequired
}

export default PortGrid;