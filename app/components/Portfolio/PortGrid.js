import React from 'react'
import Griddle from 'griddle-react'
import * as portModel from '../../models/portfolioModel'
import * as transModel from '../../models/transactionModel'
import TransEdit from '../Transaction/TransEdit'
import GridEditButtons from './GridEditButtons'
import { DateRange } from '../../utils/DateRange'
import '../../styles/globalStyles.sass'

class PortGrid extends React.Component {
	// With es6, the getInitialState is replaced by the constructor.
	constructor(props) {
		super(props);

		this.state = {
			transactions: [],
			selectedTransaction: {},
			selectedPeriod: "all"
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
		portModel.getPortfolioTransactions(portfolio.id, DateRange.getDateRangeByPeriod("all"))
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

	handlePeriodChage(period) {
		// reset all buttons
		$("#ytd").removeClass("active");
		$("#all").removeClass("active");
		$("#qtd").removeClass("active");
		$("#mtd").removeClass("active");

		// set the requested one
		$("#" + period).addClass("active");

		const dr = DateRange.getDateRangeByPeriod(period)
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
          <button type="button" id="all" className="btn btn-primary" onClick={() => this.handlePeriodChage('all')}>All Time</button>
          <button type="button" id="ytd" className="btn btn-primary" onClick={() => this.handlePeriodChage('ytd')}>YTD</button>
          <button type="button" id="qtd" className="btn btn-primary" onClick={() => this.handlePeriodChage('qtd')}>QTD</button>
          <button type="button" id="mtd" className="btn btn-primary" onClick={() => this.handlePeriodChage('mtd')}>MTD</button>
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
