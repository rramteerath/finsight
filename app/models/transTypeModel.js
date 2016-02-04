import axios from 'axios'

const baseUrl = 'http://localhost:9001/'

export function getTransTypeList() {
	return axios.get(baseUrl + 'transTypes')
}
