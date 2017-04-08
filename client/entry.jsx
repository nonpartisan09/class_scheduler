import React from 'react';
import {render} from 'react-dom';

import configureStore from './store/configure_store';

import AppProvider from './components/app_provider';
import AppRouter from './components/app_router';

const user = JSON.parse(localStorage.getItem("user")) || {}

const store = configureStore({
	session: {
		user
	},
	language: {
		default: user.language || "eng"
	}
});

const App = () => (
	<AppProvider store={store}>
		<AppRouter />
	</AppProvider>
)

document.addEventListener("DOMContentLoaded", ()=>{
	render(<App/>, document.querySelector("#root"))
})