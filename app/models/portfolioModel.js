import axios from 'axios'

const baseUrl = 'http://localhost:9001/'

export function getPortfolioList() {
	return axios.get(baseUrl + 'portfolios')
}

export function getPortfolioTransactions(portfolioId) {
	return axios.get(baseUrl + 'trans?portfolioId=' + portfolioId)
}

