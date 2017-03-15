import React from 'react'
import {Router, Route, IndexRoute, hashHistory} from 'react-router'

import Layout from './layout'
import Home from './home'

const AppRouter = () => (
	<Router history={hashHistory}>
    <Route path="/" component={Layout}>
    	<Route path="/home" component={Home}/>
    	<IndexRoute component={Home}/>
    </Route>
	</Router>
);

export default AppRouter;