import React from 'react'
import {BrowserRouter, Route, IndexRoute} from 'react-router'
import {ConnectedRouter} from 'react-router-redux'

import Layout from './layout'
import Home from './home'

const AppRouter = ({history}) => (
	<ConnectedRouter history={history}>

    <Route path="/" component={Layout}>
    	<Route path="/home" component={Home}/>
    </Route>
    
	</ConnectedRouter>
);

export default AppRouter;