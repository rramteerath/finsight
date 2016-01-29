import axios from 'axios'

const baseUrl = 'http://localhost:9001/';

export function getPortfolioList() {
	return axios.get(baseUrl + 'portfolios'); 
}

export function getTransactions(id) {
	return axios.get(baseUrl + 'trans'); 
	// return axios.get(baseUrl + 'trans/' + id); 
}

