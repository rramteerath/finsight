import * as portModel from '../models/portfolioModel'

export function loadTransactions(portfolioId) {
  return {
    type: 'LOAD_TRANS',
    portfolioId
  }
}

// Use redux-thunk to create async action creator
export function loadPortfolios() {
  return (dispatch) => {
    portModel.getPortfolioList()
			.then((portfolios) => {
        dispatch({
          type: 'LOAD_PORTFOLIOS',
          portfolios
        })
    })
  }
}

export function portfolioChanged(portfolio) {
  console.log("portfolioChanged action creator called")

  return (dispatch) => {
    portModel.getTransactionRelatedData(portfolio.get('id'))
			.then((transData) => {
        console.log("transData", transData)
        dispatch({
          type: 'PORTFOLIO_CHANGED',
          portfolio,
          transData
        })
    })
  }
}

export function loadTransactions(portfolio) {
  console.log("loadTransactions action creator called")

  return (dispatch) => {
    portModel.getTransactionRelatedData(portfolio.get('id'))
			.then((transData) => {
        dispatch({
          type: 'LOAD_TRANSACTIONS',
          transData
        })
    })
  }
}
