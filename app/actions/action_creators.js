export function loadTransactions(portfolioId) {
  return {
    type: 'LOAD_TRANS',
    portfolioId
  }
}

export function loadPrices(portfolioId) {
  return {
    type: 'LOAD_PRICES',
    portfolioId
  }
}
