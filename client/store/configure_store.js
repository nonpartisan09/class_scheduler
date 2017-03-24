import { createStore, applyMiddleware, combineReducers } from 'redux';

import thunk from 'redux-thunk';
import logger from 'redux-logger';

import reducers from '../reducers/'

const middleware = [
	thunk, 
	logger(), 
]

const configureStore = (preloadedState = {}) => {
	return createStore(
		combineReducers(reducers),
    preloadedState,
    applyMiddleware(...middleware)
  );
};

export default configureStore;
