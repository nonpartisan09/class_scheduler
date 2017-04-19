import React from 'react';
import { render } from 'react-dom';

import configureStore from './store/configure_store';

import AppProvider from './components/app_provider';
import AppRouter from './components/app_router';

const store = configureStore({
	session: {
		user: JSON.parse(window.localStorage.currentUser),
	},
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
