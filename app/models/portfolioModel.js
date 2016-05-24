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

	// Get subset of prices that fall within the date range
	const priceSubset = prices.filter(p => (p.date >= dateRange.startDate.toISOString())
		&& (p.date <= dateRange.endDate.toISOString()))

	// Get ticker and trans type names from associated ids for display.
	// Use _.defaults to combine these with the original transactions array

  // The market value calculation filters the prices list by a specific ticker
  // then gets the price from the latest date of this subset.
	// TODO: Need to do some serious optimization here.
	return transactions.map(trans => _.defaults(trans, {
			"ticker": _.find(tickers, k => k.id == trans.tickerId).symbol,
			"transType": _.find(transTypes, m => m.id == trans.transactionTypeId).name,
			// "formattedExecDate": new Date(trans.executionDate).toLocaleDateString('en-US'),
			"formattedExecDate": new Date(getResolvedStartPrice(priceSubset, trans, dateRange).date).toLocaleDateString('en-US'),

			// startPrice will either be the price paid or the starting price in the date range
			"startPrice": getResolvedStartPrice(priceSubset, trans, dateRange).price,
			"costBasis": numbers.formatCurrency(calcCostBasis(priceSubset, trans, dateRange)),
			"marketValue": numbers.formatCurrency(calcMarketVal(priceSubset, trans)),
			"pl": numbers.formatCurrency(calcMarketVal(priceSubset, trans) - calcCostBasis(priceSubset, trans, dateRange)),
			"editField": "",
			"currPrice": getLatestPriceByTickerId(priceSubset, trans.tickerId).price
		})
	)
}

// Calculate cost basis for buys and reinvest
function calcCostBasis(prices, trans, dateRange) {
	return (trans.transactionTypeId === 1 || trans.transactionTypeId === 3)
		? getResolvedStartPrice(prices, trans, dateRange).price * trans.quantity - trans.commission
		: 0
}

// Calculate market value for buys and reinvest
function calcMarketVal(prices, trans) {
	return (trans.transactionTypeId == 1 || trans.transactionTypeId == 3)
		? getLatestPriceByTickerId(prices, trans.tickerId).price * trans.quantity
		: 0
}

// Get the starting price that the performance calc will be based.
// Rules...
// If purchase date falls outside date range, get earliest price within date range.
// If purchase date falls within date range, get the transaction price.
// Returns: {date, price}
function getResolvedStartPrice(prices, transaction, dateRange) {
	const earliestPrice = getEarliestPriceByTickerId(prices, transaction.tickerId)

	if (transaction.executionDate < dateRange.startDate.toISOString())
	 	return { "date": earliestPrice.date, "price": earliestPrice.price }
	else
		return { "date": transaction.executionDate, "price": transaction.price }
}

// Get the latest price for the specified tickerId.
// 1. Get all prices for current ticker.
// 2. Get item with the max date from the the above result.
// 3. Get the corresponding price from the above result.
// Note that returned price is a price record with date, price, etc.
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
		&& d.tickerId === tickerId)[0]
}

function getEarliestPriceByTickerId(prices, tickerId) {
	return prices.filter(d =>
		d.date === (_.min(prices.filter(p => tickerId === p.tickerId).map(i => i.date)))
		&& d.tickerId === tickerId)[0]
}

// getPortfolioTransactionsBase
export function getPortfolioTransactionsBase(portfolioId) {
	return axios.get(baseUrl + 'trans?portfolioId=' + portfolioId)
}
