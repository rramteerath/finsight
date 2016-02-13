import axios from 'axios'

const baseUrl = 'http://localhost:9001/'

export function saveTransaction(transaction) {
	console.log("transaction", transaction)
	if (!transaction)
		return

	if (transaction.id)
		return axios.put(baseUrl + 'trans/' + transaction.id, transaction)
	else
		return axios.post(baseUrl + 'trans', transaction)
}

export function deleteTransaction(transaction) {
	return axios.delete(baseUrl + 'trans/' + transaction.id)
}
