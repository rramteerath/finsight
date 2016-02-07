import axios from 'axios'
import * as tickerModel from './tickerModel'
import * as transTypeModel from './transTypeModel'

const baseUrl = 'http://localhost:9001/'

export function getPortfolioList() {
	return axios.get(baseUrl + 'portfolios')
}

// Returns transactions for the specified id. Also returns tickers and transaction
// types in order to map ticker and trans id to their names for display.
export function getPortfolioTransactions(portfolioId) {
	return axios.all([getPortfolioTransactionsBase(portfolioId), 
		tickerModel.getTickerList(), 
		transTypeModel.getTransTypeList()])
			.then(axios.spread((transactions, tickers, transTypes) => 
				fillModel(transactions.data, tickers.data, transTypes.data)))
}

function fillModel(transactions, tickers, transTypes) {
	// Get ticker and trans type names from associated ids for display.
	// Use _.defaults to combine these with the original transactions array
	return _.map(transactions, (trans) => _.defaults(trans, {
		"ticker": _.find(tickers, (k) => k.id == trans.tickerId).symbol,
		"transType": _.find(transTypes, (m) => m.id == trans.transactionTypeId).name,
		"formattedExecDate": new Date(trans.executionDate).toLocaleDateString('en-US'),
		"editField": ""
	}))
}

export function getPortfolioTransactionsBase(portfolioId) {
	return axios.get(baseUrl + 'trans?portfolioId=' + portfolioId)
}
