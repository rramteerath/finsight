import {Map, List, toJSON, fromJS} from 'immutable';

function setState(state, newState) {
  return state.merge(newState);
}

function addItem(state, portfolioId) {
  const itemId = state.get('transactions').reduce((maxId, item) => Math.max(maxId,item.get('id')), 0) + 1;
  const newItem = Map({id: itemId, portfolioId: portfolioId, status: 'active'});
  return state.update('transactions', (transactions) => transactions.push(newItem));
}

function loadPortfolios(state, portData) {
  return state.set('portfolios', fromJS(portData.data))
    .set('selectedPortfolio', fromJS(portData.data.find((i) => i.id === 1)))
}

function portfolioChanged(state, portfolio, transData) {
  const itemIndex = state.get('portfolios').findIndex((item) =>
    item.get('id') === portfolio.get('id'))

  return state.set('selectedPortfolio', state.get('portfolios').get(itemIndex))
    .set('transactions', fromJS(transData.transactions))
    .set('prices', fromJS(transData.prices))
    .set('tickers', fromJS(transData.tickers))
    .set('transTypes', fromJS(transData.transTypes))
}

function loadTransactions(state, transData) {
  return state.set('transactions', transData.transactions)
}

function periodChanged(state, period) {
  return state.set('period', period);
}

function durationHeldChanged(state, duration) {
  return state.set('durationHeld', duration);
}

function reinvCalcChanged(state, reinvCalc) {
  return state.set('reinvCalc', reinvCalc);
}

function selectTransaction(state, transaction) {
  return state.set('selectedTransaction', transaction)
}

function cancelTransactionEdit(state) {
  return state.set('selectedTransaction', {})
  // console.log("newState", newState)
  // console.log("newState json", newState.toJSON())
  // return newState
}

export default function(state = Map(), action) {
  switch (action.type) {
    case 'SET_STATE':
      return setState(state, action.state);
    case 'LOAD_PORTFOLIOS':
      return loadPortfolios(state, action.portfolios)
    case 'PORTFOLIO_CHANGED':
      return portfolioChanged(state, action.portfolio, action.transData)
    case 'LOAD_TRANSACTIONS':
      return loadTransactions(state, action.transData)
    case 'PERIOD_CHANGED':
      return periodChanged(state, action.period)
    case 'DURATION_HELD_CHANGED':
      return durationHeldChanged(state, action.duration)
    case 'REINV_CALC_CHANGED':
      return reinvCalcChanged(state, action.reinvCalc)
    case 'SELECT_TRANSACTION':
      return selectTransaction(state, action.transaction)
    case 'CANCEL_TRANSACTION_EDIT':
      return cancelTransactionEdit(state)
  }

  return state;
}
