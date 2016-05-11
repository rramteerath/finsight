import React from 'react'
import Griddle from 'griddle-react'
import * as portModel from '../../models/portfolioModel'
import * as transModel from '../../models/transactionModel'
import TransEdit from '../Transaction/TransEdit'
import GridEditButtons from './GridEditButtons'
import '../../styles/globalStyles.sass'

class PortGrid extends React.Component {
	// With es6, the getInitialState is replaced by the constructor.
	constructor(props) {
		super(props);

		this.state = {
			transactions: [],
			selectedTransaction: {}
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
		//console.log(this.state);
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

	handleEditTransaction(trans) {
		this.setState({selectedTransaction: trans})
	}

	handleDeleteTransaction(trans) {
		transModel.deleteTransaction(trans)
			.then((res) => {
				// TODO: Check return codes
				this.getTransactions(this.props.currentPortfolio)
			})
	}


	render() {
		const colMeta = [
			{"columnName": "formattedExecDate", "displayName": "Exec Date", "cssClassName": "col-sm-2"},
			{"columnName": "transType", "displayName": "Type", "cssClassName": "col-sm-1"},
			{"columnName": "ticker", "displayName": "Ticker", "cssClassName": "col-sm-1"},
			{"columnName": "quantity", "displayName": "Quantity", "cssClassName": "col-sm-1 align-right"},
			{"columnName": "price", "displayName": "Price Paid", "cssClassName": "col-sm-1 align-right"},
			{"columnName": "currPrice", "displayName": "Current Price", "cssClassName": "col-sm-1 align-right"},
			{"columnName": "commission", "displayName": "Comm", "cssClassName": "col-sm-1 align-right"},
			{"columnName": "costBasis", "displayName": "Cost Basis", "cssClassName": "col-sm-2 align-right"},
			{"columnName": "marketValue", "displayName": "Market Val", "cssClassName": "col-sm-1 align-right"},
			{"columnName": "editField", "displayName": "", "cssClassName": "col-sm-1",
				"customComponent": GridEditButtons, 
				"onDeleteClick": this.handleDeleteTransaction.bind(this),
				"onEditClick": this.handleEditTransaction.bind(this)
			}
		]

		return (
			<div>
        <div className="btn-group">
          <button type="button" className="btn btn-primary">All Time</button>
          <button type="button" className="btn btn-primary">YTD</button>
          <button type="button" className="btn btn-primary">QTD</button>
          <button type="button" className="btn btn-primary">MTD</button>
        </div>
				<div>
					<Griddle results={this.state.transactions} columnMetadata={colMeta}
					showFilter={false} resultsPerPage="15" showSettings={true}
          columns={["formattedExecDate", "transType", "ticker", "quantity", "currPrice", "price", "commission", "costBasis", "marketValue", "editField"]}/>
				</div>

				<div>
					<TransEdit 
						currentPortfolio={this.props.currentPortfolio}
						selectedTransaction={this.state.selectedTransaction}
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