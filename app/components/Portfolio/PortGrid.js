import React from 'react'
import Griddle from 'griddle-react'
import * as portModel from '../../models/portfolioModel'
import * as transModel from '../../models/transactionModel'
import TransEdit from '../Transaction/TransEdit'
import GridEditButtons from './GridEditButtons'
import { DateRange } from '../../utils/DateRange'
import { DATE_PERIOD_ALL, DATE_PERIOD_YTD, DATE_PERIOD_QTD, DATE_PERIOD_MTD } from '../../utils/datePeriods'
import { DURATION_ALL, DURATION_LT, DURATION_ST } from '../../utils/durationHeldConstants'
import { CurrencyFormatter } from '../Common/CurrencyFormatter'
import { PLFormatter } from '../Common/PLFormatter'
import { NumberUtils } from '../../utils/NumberUtils';
import { TransRequestParams } from '../../data/TransRequestParams'

import '../../styles/globalStyles.sass'

class PortGrid extends React.Component {
	// With es6, the getInitialState is replaced by the constructor.
	constructor(props) {
		super(props);

		this.state = {
			transactions: [],
			selectedTransaction: {},
			selectedPeriod: DATE_PERIOD_ALL,
			summary: {},
			reinvAsGain: true,
			selectedDurationHeld: DURATION_ALL
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
		// Parameters needed to select, filter desired transactions
		const transParams = new TransRequestParams(portfolio.id,
			DateRange.getDateRangeByPeriod(this.state.selectedPeriod),
			this.state.reinvAsGain,
			this.state.selectedDurationHeld)
		portModel.getPortfolioTransactions(transParams)
			.then((response) => {
				const summary = response === [] ? {
					"costBasis": response.map(trans => trans.costBasis).reduce((a, b) => a + b),
					"mktVal": response.map(trans => trans.marketValue).reduce((a, b) => a + b),
					"pl": response.map(trans => trans.pl).reduce((a, b) => a + b)
				} :
				{
					"costBasis": 0,
					"mktVal": 0,
					"pl": 0
			}
				this.setState({transactions: response, summary: summary}, () => {
					this.toggleActivePeriod(this.state.selectedPeriod)

					// TODO: put these in constants
					this.toggleReinvOption(this.state.reinvAsGain ? 'reinvg' : 'reinvb')

					this.toggleDurationPeriod(this.state.selectedDurationHeld)
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

	handlePeriodChange(period) {
		// Note that setState does not immediately mutate this.state.
		// See https://facebook.github.io/react/docs/component-api.html
		// If you need to do something that depends on the state you just set
		// then pass it into a callback when doing setState...
		this.setState({ selectedPeriod: period }, () => {

			this.getTransactions(this.props.currentPortfolio)
			this.toggleActivePeriod(period)
		})
	}

	handleReinvCalcChange(val) {
		this.setState({reinvAsGain: val === 'reinvg'}, () => {
			this.getTransactions(this.props.currentPortfolio)
			this.toggleReinvOption(val)
		})
	}

	toggleReinvOption(val) {
		$("#reinvg").removeClass("active");
		$("#reinvb").removeClass("active");

		$("#" + val).addClass("active");
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

	handleDurationHeldChange(duration) {
		this.setState({selectedDurationHeld: duration}, () => {
			this.getTransactions(this.props.currentPortfolio)
			this.toggleDurationPeriod(duration)
		})
	}

	toggleDurationPeriod(duration) {
		// reset all buttons
		$("#" + DURATION_ALL).removeClass("active");
		$("#" + DURATION_LT).removeClass("active");
		$("#" + DURATION_ST).removeClass("active");

		// set the requested one
		$("#" + duration).addClass("active");
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
			// TODO: Move toolbar into separate component
			<div>
        <div className="btn-group">
          <button type="button" id={DATE_PERIOD_ALL} className="btn btn-primary" onClick={() => this.handlePeriodChange(DATE_PERIOD_ALL)}>All Time</button>
          <button type="button" id={DATE_PERIOD_YTD} className="btn btn-primary" onClick={() => this.handlePeriodChange(DATE_PERIOD_YTD)}>YTD</button>
          <button type="button" id={DATE_PERIOD_QTD} className="btn btn-primary" onClick={() => this.handlePeriodChange(DATE_PERIOD_QTD)}>QTD</button>
          <button type="button" id={DATE_PERIOD_MTD} className="btn btn-primary" onClick={() => this.handlePeriodChange(DATE_PERIOD_MTD)}>MTD</button>
        </div>
				<div className="btn-group btn-bar-div">
					<button type="button" id={DURATION_ALL} className="btn btn-primary" onClick={() => this.handleDurationHeldChange(DURATION_ALL)} title="All">All</button>
					<button type="button" id={DURATION_LT} className="btn btn-primary" onClick={() => this.handleDurationHeldChange(DURATION_LT)} title="Long Term">LT</button>
					<button type="button" id={DURATION_ST} className="btn btn-primary" onClick={() => this.handleDurationHeldChange(DURATION_ST)} title="SHort Term">ST</button>
				</div>
				<div className="btn-group btn-bar-div">
					<button type="button" id="reinvg" className="btn btn-primary" onClick={() => this.handleReinvCalcChange('reinvg')} title="P&L calc: Reinv as gain">Reinv $</button>
					<button type="button" id="reinvb" className="btn btn-primary" onClick={() => this.handleReinvCalcChange('reinvb')} title="P&L calc: Reinv as buy">Reinv B</button>
				</div>
				<div>
					<Griddle results={this.state.transactions} columnMetadata={colMeta}
					showFilter={false} resultsPerPage="15" showSettings={true}
          columns={["formattedExecDate", "transType", "ticker", "quantity", "currPrice", "startPrice", "commission", "costBasis", "marketValue", "pl", "editField"]}/>
				</div>

				<div className="row">
					<div className="col-sm-8 summary">Totals</div>
					<div className="col-sm-1 summary align-right"><CurrencyFormatter data={(this.state.summary.costBasis)} /></div>
					<div className="col-sm-1 summary align-right"><CurrencyFormatter data={(this.state.summary.mktVal)} /></div>
					<div className="col-sm-1 summary align-right"><PLFormatter data={(this.state.summary.pl)} /></div>
					<div className="col-sm-1 summary"></div>
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
