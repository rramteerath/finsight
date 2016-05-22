import axios from 'axios'
import * as tickerModel from './tickerModel'
import * as transTypeModel from './transTypeModel'
import * as priceModel from './priceModel'
import * as numbers from '../utils/numbers'
import { DateRange } from '../utils/DateRange'

const baseUrl = 'http://localhost:9001/'

export function getPortfolioList() {
	return axios.get(baseUrl + 'portfolios')
}

// Returns transactions for the specified id. Also returns tickers and transaction
// types in order to map ticker and trans id to their names for display.
export function getPortfolioTransactions(portfolioId, dateRange) {
	return axios.all([getPortfolioTransactionsBase(portfolioId),
		tickerModel.getTickerList(),
		transTypeModel.getTransTypeList(),
		priceModel.getPriceList()])
			.then(axios.spread((transactions, tickers, transTypes, prices) =>
				fillModel(transactions.data, tickers.data, transTypes.data, prices.data, dateRange)))
}

function fillModel(transactions, tickers, transTypes, prices, dateRange) {
	// Get ticker and trans type names from associated ids for display.
	// Use _.defaults to combine these with the original transactions array

  // The market value calculation filters the prices list by a specific ticker
  // then gets the price from the latest date of this subset.
	return _.map(transactions, trans => _.defaults(trans, {
			"ticker": _.find(tickers, k => k.id == trans.tickerId).symbol,
			"transType": _.find(transTypes, m => m.id == trans.transactionTypeId).name,
			"formattedExecDate": new Date(trans.executionDate).toLocaleDateString('en-US'),
			"costBasis": (trans.transactionTypeId == 1 || trans.transactionTypeId == 3)
				? numbers.formatCurrency((trans.price * trans.quantity) - trans.commission) : 0.00,
			"marketValue": (trans.transactionTypeId == 1 || trans.transactionTypeId == 3)
				? numbers.formatCurrency(getLatestPriceByTickerId(prices, trans.tickerId) * trans.quantity) : 0.00,
			"editField": "",
			"currPrice": getLatestPriceByTickerId(prices, trans.tickerId)
		})
	).filter(t => (t.executionDate >= dateRange.startDate.toISOString())
			&& (t.executionDate <= dateRange.endDate.toISOString()))
}

// Get the latest price for the specified tickerId.
// 1. Get all prices for current ticker.
// 2. Get item with the max date from the the above result.
// 3. Get the corresponding price from the above result.
function getLatestPriceByTickerId(prices, tickerId) {
	// const filtered = _.filter(prices, p => tickerId === p.tickerId)
	// console.log("filtered", filtered)
	// const mapped = filtered.map(i => i.date)
	// console.log("mapped", mapped)
	// const maxxed = _.max(mapped)
	// console.log("maxxed", maxxed)
	// const priced = prices.filter(d => d.date === maxxed && d.tickerId === tickerId)
	// console.log("priced", priced[0].price)

	return prices.filter(d =>
		d.date === (_.max(prices.filter(p => tickerId === p.tickerId).map(i => i.date)))
		&& d.tickerId === tickerId)[0].price
}

// getPortfolioTransactionsBase
export function getPortfolioTransactionsBase(portfolioId) {
	return axios.get(baseUrl + 'trans?portfolioId=' + portfolioId)
}
