import React from 'react';
import {Provider} from 'react-redux';
import AppRouter from './app_router';

const AppProvider = ({store, children}) => (
	<Provider store={store}>
		{children}
	</Provider>
)

export default AppProvider;