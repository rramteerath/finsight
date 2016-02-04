import axios from 'axios'

const baseUrl = 'http://localhost:9001/'

export function saveTransaction(transaction) {
	if (!transaction)
		return

	if (transaction.id)
		return axios.put(baseUrl + 'trans', transaction)
	else
		return axios.post(baseUrl + 'trans', transaction)
}
