import React from 'react'
import Griddle from 'griddle-react'
import {Map, toJSON} from 'immutable';
import * as portModel from '../../models/portfolioModel'
import * as transModel from '../../models/transactionModel'
import TransEdit from '../Transaction/TransEdit'
import GridEditButtons from './GridEditButtons'
import { DateRange } from '../../utils/DateRange'
import { DATE_PERIOD_ALL, DATE_PERIOD_YTD, DATE_PERIOD_QTD, DATE_PERIOD_MTD } from '../../utils/datePeriods'
import { DURATION_ALL, DURATION_LT, DURATION_ST } from '../../utils/durationHeldConstants'
import { REINV_CALC_GAIN, REINV_CALC_BUY } from '../../utils/reinvCalcConstants'
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
			selectedTransaction: {},
		}
	}

	getTransactions() {
		// Parameters needed to select, filter desired transactions
		const transParams = new TransRequestParams(this.props.selectedPortfolio.get('id'),
			DateRange.getDateRangeByPeriod(this.props.period),
			this.props.reinvCalc === REINV_CALC_GAIN,
			this.props.durationHeld)

		return portModel.fillModel(this.props.transactions.toJSON(),
			this.props.tickers.toJSON(),
			this.props.transTypes.toJSON(),
			this.props.prices.toJSON(),
			transParams)
	}

	// Called when the transactions in the current portfolio have been updated, added, deleted.
	handleTransactionsChanged(portfolio) {
		this.getTransactions(this.props.selectedPortfolio)
	}

	handleEditTransaction(trans) {
		this.setState({selectedTransaction: trans})
	}

	handleDeleteTransaction(trans) {
		transModel.deleteTransaction(trans)
			.then((res) => {
				// TODO: Check return codes
				this.getTransactions(this.props.selectedPortfolio)
			})
	}

	getToolbarButtonClasses(selectedPeriod, period) {
		return "btn btn-primary " + ((selectedPeriod === period) ? "active" : "")
	}

	render() {
		const transactions = this.getTransactions()
		const summary = transactions.length === 0 ?
			{
				"costBasis": 0,
				"mktVal": 0,
				"pl": 0
			}
			:
			{
				"costBasis": transactions.map(trans => trans.costBasis).reduce((a, b) => a + b),
				"mktVal": transactions.map(trans => trans.marketValue).reduce((a, b) => a + b),
				"pl": transactions.map(trans => trans.pl).reduce((a, b) => a + b)
			}

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
        <div className="btn-group btn-bar-div">
          <button type="button" id={DATE_PERIOD_ALL} className={this.getToolbarButtonClasses(this.props.period, DATE_PERIOD_ALL)} onClick={() => this.props.periodChanged(DATE_PERIOD_ALL)}>All Time</button>
          <button type="button" id={DATE_PERIOD_YTD} className={this.getToolbarButtonClasses(this.props.period, DATE_PERIOD_YTD)} onClick={() => this.props.periodChanged(DATE_PERIOD_YTD)}>YTD</button>
          <button type="button" id={DATE_PERIOD_QTD} className={this.getToolbarButtonClasses(this.props.period, DATE_PERIOD_QTD)} onClick={() => this.props.periodChanged(DATE_PERIOD_QTD)}>QTD</button>
          <button type="button" id={DATE_PERIOD_MTD} className={this.getToolbarButtonClasses(this.props.period, DATE_PERIOD_MTD)} onClick={() => this.props.periodChanged(DATE_PERIOD_MTD)}>MTD</button>
        </div>
				<div className="btn-group btn-bar-div">
					<button type="button" id={DURATION_ALL} className={this.getToolbarButtonClasses(this.props.durationHeld, DURATION_ALL)} onClick={() => this.props.durationHeldChanged(DURATION_ALL)} title="All">All</button>
					<button type="button" id={DURATION_LT} className={this.getToolbarButtonClasses(this.props.durationHeld, DURATION_LT)} onClick={() => this.props.durationHeldChanged(DURATION_LT)} title="Long Term">LT</button>
					<button type="button" id={DURATION_ST} className={this.getToolbarButtonClasses(this.props.durationHeld, DURATION_ST)} onClick={() => this.props.durationHeldChanged(DURATION_ST)} title="SHort Term">ST</button>
				</div>
				<div className="btn-group">
					<button type="button" id={REINV_CALC_GAIN} className={this.getToolbarButtonClasses(this.props.reinvCalc, REINV_CALC_GAIN)} onClick={() => this.props.reinvCalcChanged(REINV_CALC_GAIN)} title="P&L calc: Reinv as gain">Reinv $</button>
					<button type="button" id={REINV_CALC_BUY} className={this.getToolbarButtonClasses(this.props.reinvCalc, REINV_CALC_BUY)} onClick={() => this.props.reinvCalcChanged(REINV_CALC_BUY)} title="P&L calc: Reinv as buy">Reinv B</button>
				</div>
				<div>
					<Griddle results={transactions} columnMetadata={colMeta}
					showFilter={false} resultsPerPage="15" showSettings={true}
          columns={["formattedExecDate", "transType", "ticker", "quantity", "currPrice", "startPrice", "commission", "costBasis", "marketValue", "pl", "editField"]}/>
				</div>

				<div className="row">
					<div className="col-sm-8 summary">Totals</div>
					<div className="col-sm-1 summary align-right"><CurrencyFormatter data={(summary.costBasis)} /></div>
					<div className="col-sm-1 summary align-right"><CurrencyFormatter data={(summary.mktVal)} /></div>
					<div className="col-sm-1 summary align-right"><PLFormatter data={(summary.pl)} /></div>
					<div className="col-sm-1 summary"></div>
				</div>

				<div>
					<TransEdit
						currentPortfolio={this.props.selectedPortfolio}
						selectedTransaction={this.state.selectedTransaction}
						transactionsChanged={() => this.handleTransactionsChanged()} />
				</div>
			</div>
		)
	}
}

PortGrid.propTypes = {
	selectedPortfolio: React.PropTypes.object.isRequired
}

export default PortGrid;
