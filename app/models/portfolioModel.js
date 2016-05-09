import axios from 'axios'
import * as tickerModel from './tickerModel'
import * as transTypeModel from './transTypeModel'
import * as priceModel from './priceModel'
import * as numbers from '../utils/numbers'

const baseUrl = 'http://localhost:9001/'

export function getPortfolioList() {
	return axios.get(baseUrl + 'portfolios') 
}

// Returns transactions for the specified id. Also returns tickers and transaction
// types in order to map ticker and trans id to their names for display.
export function getPortfolioTransactions(portfolioId) {
	return axios.all([getPortfolioTransactionsBase(portfolioId), 
		tickerModel.getTickerList(), 
		transTypeModel.getTransTypeList(),
		priceModel.getPriceList()])
			.then(axios.spread((transactions, tickers, transTypes, prices) =>
				fillModel(transactions.data, tickers.data, transTypes.data, prices.data)))
}

function fillModel(transactions, tickers, transTypes, prices) {
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
      ? numbers.formatCurrency(
        _.max(_.filter(prices,
        p => trans.tickerId == p.tickerId), 'date').price * trans.quantity) : 0.00,
		"editField": ""
	}))
}

// getPortfolioTransactionsBase
export function getPortfolioTransactionsBase(portfolioId) {
	return axios.get(baseUrl + 'trans?portfolioId=' + portfolioId)
}
