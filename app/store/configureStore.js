import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
// import api from '../middleware/api'
import reducer from '../reducers/reducer'
import { DATE_PERIOD_ALL, DATE_PERIOD_YTD, DATE_PERIOD_QTD, DATE_PERIOD_MTD } from '../utils/datePeriods'
import { DURATION_ALL, DURATION_LT, DURATION_ST } from '../utils/durationHeldConstants'
import { REINV_CALC_GAIN, REINV_CALC_BUY } from '../utils/reinvCalcConstants'

export function getInitialState() {
  return {
    portfolios: [],
    selectedPortfolio: {},
    transactions: [],
    prices: [],
    tickers: [],
    transTypes: [],
    period: DATE_PERIOD_ALL,
    reinvCalc: REINV_CALC_GAIN,
    durationHeld: DURATION_ALL
  }
}

export function configureStore(preloadedState) {
  return createStore(
    reducer,
    preloadedState,
    applyMiddleware(thunk)
  )
}
