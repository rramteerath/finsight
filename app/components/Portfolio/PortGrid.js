import React from 'react'
import Griddle from 'griddle-react'
import * as portModel from '../../models/portfolioModel'
import * as transModel from '../../models/transactionModel'
import TransEdit from '../Transaction/TransEdit'
import GridEditButtons from './GridEditButtons'
import { DateRange } from '../../utils/DateRange'
import { DATE_PERIOD_ALL, DATE_PERIOD_YTD, DATE_PERIOD_QTD, DATE_PERIOD_MTD } from '../../utils/datePeriods'
import { CurrencyFormatter } from '../Common/CurrencyFormatter'
import { PLFormatter } from '../Common/PLFormatter'
import '../../styles/globalStyles.sass'

class PortGrid extends React.Component {
	// With es6, the getInitialState is replaced by the constructor.
	constructor(props) {
		super(props);

		this.state = {
			transactions: [],
			selectedTransaction: {},
			selectedPeriod: DATE_PERIOD_ALL,
			summary: {}
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
		if (this.props.currentPortfolio.id) {
			this.getTransactions(this.props.currentPortfolio)
		}
	}

	getTransactions(portfolio) {
		portModel.getPortfolioTransactions(portfolio.id, DateRange.getDateRangeByPeriod(this.state.selectedPeriod))
			.then((response) => {

				this.setState({transactions: response}, () => {
					this.toggleActivePeriod(this.state.selectedPeriod)
				})
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
		// Note that setState does not immediately mutate this.state.
		// See https://facebook.github.io/react/docs/component-api.html
		// If you need to do something that depends on the state you just set
		// then pass it into a callback when doing setState...
		this.setState({ selectedPeriod: period }, () => {

			this.getTransactions(this.props.currentPortfolio)
			this.toggleActivePeriod(period)
		})
	}

	toggleActivePeriod(period) {
		// reset all buttons
		$("#" + DATE_PERIOD_ALL).removeClass("active");
		$("#" + DATE_PERIOD_YTD).removeClass("active");
		$("#" + DATE_PERIOD_QTD).removeClass("active");
		$("#" + DATE_PERIOD_MTD).removeClass("active");

		// set the requested one
		$("#" + period).addClass("active");
	}


	render() {
		const colMeta = [
			{"columnName": "formattedExecDate", "displayName": "Exec Date", "cssClassName": "col-sm-2"},
			{"columnName": "transType", "displayName": "Type", "cssClassName": "col-sm-1"},
			{"columnName": "ticker", "displayName": "Ticker", "cssClassName": "col-sm-1"},
			{"columnName": "quantity", "displayName": "Quantity", "cssClassName": "col-sm-1 align-right"},
			// {"columnName": "price", "displayName": "Price Paid", "cssClassName": "col-sm-1 align-right"},
			{"columnName": "startPrice", "displayName": "Start Price", "cssClassName": "col-sm-1 align-right"},
			{"columnName": "currPrice", "displayName": "Current Price", "cssClassName": "col-sm-1 align-right"},
			{"columnName": "commission", "displayName": "Comm", "cssClassName": "col-sm-1 align-right"},
			{"columnName": "costBasis", "displayName": "Cost Basis", "cssClassName": "col-sm-1 align-right", "customComponent": CurrencyFormatter},
			{"columnName": "marketValue", "displayName": "Market Val", "cssClassName": "col-sm-1 align-right", "customComponent": CurrencyFormatter},
			{"columnName": "pl", "displayName": "P&L", "cssClassName": "col-sm-1 align-right", "customComponent": PLFormatter},
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
          columns={["formattedExecDate", "transType", "ticker", "quantity", "currPrice", "startPrice", "commission", "costBasis", "marketValue", "pl", "editField"]}/>
				</div>

				{ /* TODO - Add summary row
				<div className="row">
					<div className="col-sm-8 summary">Totals</div>
					<div className="col-sm-1 summary align-right">123</div>
					<div className="col-sm-1 summary align-right">456</div>
					<div className="col-sm-1 summary align-right">789</div>
					<div className="col-sm-1 summary"></div>
				</div> */}

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
