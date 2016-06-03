import * as portModel from '../models/portfolioModel'

export function loadTransactions(portfolioId) {
  return {
    type: 'LOAD_TRANS',
    portfolioId
  }
}

// Use redux-thunk middleware to create async action creator
// Middleware loaded when creating redux store
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
  return (dispatch) => {
    portModel.getTransactionRelatedData(portfolio.get('id'))
			.then((transData) => {
        dispatch({
          type: 'PORTFOLIO_CHANGED',
          portfolio,
          transData
        })
    })
  }
}

export function loadTransactions(portfolio) {
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

export function periodChanged(period) {
  return {
    type: 'PERIOD_CHANGED',
    period
  }
}

export function durationHeldChanged(duration) {
  return {
    type: 'DURATION_HELD_CHANGED',
    duration
  }
}

export function reinvCalcChanged(reinvCalc) {
  return {
    type: 'REINV_CALC_CHANGED',
    reinvCalc
  }
}

export function selectTransaction(transaction) {
  return {
    type: 'SELECT_TRANSACTION',
    transaction
  }
}

export function cancelTransactionEdit() {
  return {
    type: 'CANCEL_TRANSACTION_EDIT',
  }
}
