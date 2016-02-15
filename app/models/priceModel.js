import axios from 'axios'

const baseUrl = 'http://localhost:9001/'

export function getPriceList() {
  return axios.get(baseUrl + 'price')
}

export function getPriceListByDate(date) {
  return axios.get(baseUrl + 'price?date=' + date)
}

export function savePrice(price) {
  if (!price)
    return

  if (price.id)
    return axios.put(baseUrl + 'price/' + price)
  else
    return axios.post(baseUrl + 'price', price)
}

export function deletePrice(price) {
  return axios.delete(baseUrl + 'price/' + transaction.id)
}
