import React from 'react';
import * as portModel from '../../models/portfolioModel';
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

	componentWillReceiveProps(nextProps) {

	}

	componentWillUnmount() {
		console.log(this.state);
	}

	init(props) {
		portModel.getTransactions(1)
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

export default PortGrid;