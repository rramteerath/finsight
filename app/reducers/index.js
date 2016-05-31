// import * as ActionTypes from '../actions'
// import merge from 'lodash/merge'
// import { routerReducer as routing } from 'react-router-redux'
import { combineReducers } from 'redux'
import {Map} from 'immutable';

function loadTransaction(state, portfolioId) {
  console.log("loadTransaction state", state)
  const newItem = Map({transId: 1, portId: portfolioId});
  return state.merge(newItem)
  // return state.update('transactions', (transactions) => {
  //   if (!transactions) {
  //     transactions = new Map()
  //     // transactions.add(newItem)
  //   }
  //   // else
  //   transactions.push(newItem);
  // })
}

const transReducer = function(state = Map(), action) {
  switch (action.type) {
    case 'LOAD_TRANS':
      const newState = loadTransaction(state, action.portfolioId);
      console.log("newState", newState)
      return newState
  }

  console.log("state in reducer", state)
  return state;
}


const priceReducer = function (state = Map(), action) {
    // console.log('priceReducer was called with state', state, 'and action', action)

    switch (action.type) {
        // etc.
        default:
            return state;
    }
}

const rootReducer = combineReducers({
    transactions: transReducer,
    prices: priceReducer
})

export default rootReducer
