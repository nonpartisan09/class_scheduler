import React from 'react'
import {Router, Route, IndexRoute, hashHistory} from 'react-router'

import Layout from './layout'
import Home from './home'
import StudentSignup from './student_signup';

const AppRouter = () => (
	<Router history={hashHistory}>
    <Route path="/" component={Layout}>
    	<Route path="/home" component={Home}/>
    	<Route path="/student/sign_up" component={StudentSignup}/>
    	<IndexRoute component={Home}/>
    </Route>
	</Router>
);

export default AppRouter;