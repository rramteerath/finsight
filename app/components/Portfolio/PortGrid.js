import React from 'react'
import * as portModel from '../../models/portfolioModel'
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
			.then((response) => 
				this.setState({transactions: response.data})
			)
	}

	render() {
		return (
			<div>
				<Griddle results={this.state.transactions} tableClassName="table" showFilter={true}
 				showSettings={true} columns={["executionDate", "quantity", "price", "commission"]}/>
			</div>
		)
	}
}

PortGrid.propTypes = {
	currentPortfolio: React.PropTypes.object.isRequired
}

export default PortGrid;