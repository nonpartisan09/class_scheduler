import React from 'react';
import { render } from 'react-dom';

import configureStore from './store/configure_store';

import AppProvider from './components/app_provider';
import AppRouter from './components/app_router';


// if localStorage.user, use them;

let user = {};

try {
	user = JSON.parse(window.localStorage.user) || {}
} catch (e) {
	console.log('invalid localStorage user')
}


const store = configureStore({
	session: { user },
});

window.store = store;

const App = () => (
	<AppProvider store={store}>
		<AppRouter />
	</AppProvider>
);

document.addEventListener('DOMContentLoaded', () => {
	render(<App />, document.querySelector('#root'));
});
