import axios from 'axios'

const baseUrl = 'http://localhost:9001/'

export function getTickerList() {
	return axios.get(baseUrl + 'tickers')
}
