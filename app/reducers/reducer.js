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
  return state
    .update('portfolios', (portfolios) => portfolios.merge(portData.data))
    .set('selectedPortfolio', fromJS(portData.data.find((i) => i.id === 1)))
}

function portfolioChanged(state, portfolio, transData) {
  console.log('portfolioChanged transData', transData)
  const itemIndex = state.get('portfolios').findIndex((item) =>
    item.get('id') === portfolio.get('id'))
  return state.set('selectedPortfolio', state.get('portfolios').get(itemIndex))
    .set('transactions', fromJS(transData.transactions))
    .set('prices', fromJS(transData.prices))
    .set('tickers', fromJS(transData.tickers))
    .set('transTypes', fromJS(transData.transTypes))
}

function loadTransactions(state, transData) {
  // return state
  const newTransData = state.set('transactions', transData.transactions)
  console.log("newTransData", newTransData.toJSON())
  return newTransData
}

// function loadPortfolios(state, portData) {
//   console.log('portData', portData)
//   const newState = state.update('portfolios', (portfolios) => portfolios.merge(portData.data))
//   console.log("newState", newState.toJSON())
//   return newState
// }

export default function(state = Map(), action) {
  switch (action.type) {
    case 'SET_STATE':
      return setState(state, action.state);
    case 'LOAD_PORTFOLIOS':
      return loadPortfolios(state, action.portfolios)
    case 'PORTFOLIO_CHANGED':
      console.log("action", action)
      return portfolioChanged(state, action.portfolio, action.transData)
    case 'LOAD_TRANSACTIONS':
      return loadTransactions(state, action.transData)
  }

  return state;
}
