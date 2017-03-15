import { createStore, applyMiddleware, combineReducers } from 'redux';

import thunk from 'redux-thunk';
import logger from 'redux-logger';

import language from '../reducers/language';

const middleware = [
	thunk, 
	logger(), 
]

const reducers = {
	language
}

const configureStore = (preloadedState = {}) => {
	return createStore(
		combineReducers(reducers),
    preloadedState,
    applyMiddleware(...middleware)
  );
};

export default configureStore;
