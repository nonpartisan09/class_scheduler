import React from 'react';
import {render} from 'react-dom';
import 'whatwg-fetch';

import configureStore from './store/configure_store';

import { syncHistoryWithStore } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';

import AppProvider from './components/app_provider';
import AppRouter from './components/app_router';

const history = createHistory()
const store = configureStore(history);

const App = () => (
	<AppProvider store={store}>
		<AppRouter history={history}/>
	</AppProvider>
)

document.addEventListener("DOMContentLoaded", ()=>{
	render(<App/>, document.querySelector("#root"))
})