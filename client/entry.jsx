import React from 'react';
import {render} from 'react-dom';
import 'whatwg-fetch';

import configureStore from './store/configure_store';

import { syncHistoryWithStore } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';

import AppProvider from './components/app_provider';
import AppRouter from './components/app_router';

let user
try {
	const cached = JSON.parse(localStorage.getItem("user"))
	if (cached) user = cached;
} catch(e) {
	user = {}
}


const store = configureStore({
	session: {
		user
	},
	language: {
		default: user.language || "eng"
	}
});

window.store = store;

const App = () => (
	<AppProvider store={store}>
		<AppRouter />
	</AppProvider>
)

document.addEventListener("DOMContentLoaded", ()=>{
	render(<App/>, document.querySelector("#root"))
})