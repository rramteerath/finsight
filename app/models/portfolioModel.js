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
	// Map ticker and trans type names from associated ids for display.
	return _.map(transactions, (t) => ({
		"commission": t.commission, 
		"createdAt": t.createdAt, 
		"executionDate": t.executionDate, 
		"id": t.id, 
		"portfolioId": t.portfolioId, 
		"price": t.price, 
		"quantity": t.quantity, 
		"tickerId": t.tickerId, 
		"transactionTypeId": t.transactionTypeId, 
		"updatedAt": t.updatedAt, 
		"ticker": _.find(tickers, (k) => k.id == t.tickerId).symbol,
		"transType": _.find(transTypes, (m) => m.id == t.transactionTypeId).name
	}))
}

export function getPortfolioTransactionsBase(portfolioId) {
	return axios.get(baseUrl + 'trans?portfolioId=' + portfolioId)
}
