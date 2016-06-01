import axios from 'axios'
import * as tickerModel from './tickerModel'
import * as transTypeModel from './transTypeModel'
import * as priceModel from './priceModel'
import * as numbers from '../utils/numbers'
import { DateRange } from '../utils/DateRange'
import { TransRequestParams } from '../data/TransRequestParams'
import { DURATION_ALL, DURATION_LT, DURATION_ST } from '../utils/durationHeldConstants'

const baseUrl = 'http://localhost:9001/'

export function getPortfolioList() {
	return axios.get(baseUrl + 'portfolios')
}

// Returns transactions for the specified id. Also returns tickers and transaction
// types in order to map ticker and trans id to their names for display.
export function getPortfolioTransactions(requestParams) {
	return axios.all([getPortfolioTransactionsBase(requestParams.portfolioId),
		tickerModel.getTickerList(),
		transTypeModel.getTransTypeList(),
		priceModel.getPriceList()])
			.then(axios.spread((transactions, tickers, transTypes, prices) =>
				fillModel(transactions.data,
					tickers.data,
					transTypes.data,
					prices.data,
					requestParams)))
}

export function getTransactionRelatedData(portfolioId) {
	return axios.all([getPortfolioTransactionsBase(portfolioId),
		tickerModel.getTickerList(),
		transTypeModel.getTransTypeList(),
		priceModel.getPriceList()])
			.then(axios.spread((transactions, tickers, transTypes, prices) => {
				return { transactions: transactions.data,
					tickers: tickers.data,
					transTypes :transTypes.data,
					prices: prices.data
				}
			}))
}

export function fillModel(transactions, tickers, transTypes, prices, requestParams) {

	// Get subset of prices that fall within the date range
	const priceSubset = prices.filter(p => (p.date >= requestParams.dateRange.startDate.toISOString())
		&& (p.date <= requestParams.dateRange.endDate.toISOString()))

	// Get ticker and trans type names from associated ids for display.
	// Use _.defaults to combine these with the original transactions array

  // The market value calculation filters the prices list by a specific ticker
  // then gets the price from the latest date of this subset.
	const transList = transactions.map(trans => {
		const costBasis = calcCostBasis(priceSubset, trans, requestParams.dateRange, requestParams.reinvCalc)
		const mktVal = calcMarketVal(priceSubset, trans)

		// startPrice will either be the price paid or the starting price in the date range
		const startPrice = getResolvedStartPrice(priceSubset, trans, requestParams.dateRange)

		return _.defaults(trans, {
			"ticker": _.find(tickers, k => k.id == trans.tickerId).symbol,
			"transType": _.find(transTypes, m => m.id == trans.transactionTypeId).name,
			"formattedExecDate": new Date(startPrice.date).toLocaleDateString('en-US'),
			"startPrice": startPrice.price,
			"costBasis": costBasis,
			"marketValue": mktVal,
			"pl": mktVal - costBasis,
			// "pl": numbers.formatCurrency(mktVal - costBasis),
			"editField": "",
			"currPrice": getLatestPriceByTickerId(priceSubset, trans.tickerId).price
		})
	})

	// Resolve the execution dates to include based on whether we want to see (unrealized)
	// long term, short term or all gains/losses.
	const currDate = new Date()
	const execDate = new Date(currDate.setFullYear(currDate.getFullYear() - 1)).toISOString()

	switch (requestParams.durationHeld) {
		case DURATION_LT:
			return transList.filter(t => t.executionDate < execDate)
		case DURATION_ST:
			return transList.filter(t => t.executionDate > execDate)
		case DURATION_ALL:
			return transList
	}
}

// Calculate cost basis for buys and reinvest
// If we're considering all dividends as purely gain (reinvAsGain == true)
// then our cost basis for reinv will be 0.
// TODO: Take tax implications into consideration so instead of a cost basis
// of 0 it would be (for example) 15% of the actual cost basis adjusting for
// 15% tax on dividends. These are considered realized gains since you are
// responsible for paying the taxes in the year it is distributed.
function calcCostBasis(prices, trans, dateRange, reinvAsGain) {
	if (reinvAsGain && trans.transactionTypeId === 3)
		return 0
	else
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
// Returns: Note that returned price is a price record with date, price, etc.
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
function getPortfolioTransactionsBase(portfolioId) {
	return axios.get(baseUrl + 'trans?portfolioId=' + portfolioId)
}
