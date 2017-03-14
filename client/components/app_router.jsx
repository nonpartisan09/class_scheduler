import React from 'react'
import {Router, Route} from 'react-router'
import {ConnectedRouter} from 'react-router-redux'
import Home from './home'

const AppRouter = ({history}) => (
	<ConnectedRouter history={history}>
		<Route path="/" component={Home}/>
	</ConnectedRouter>
);

export default AppRouter;