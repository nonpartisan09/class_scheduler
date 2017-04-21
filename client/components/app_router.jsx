import React from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import Layout from './layout';
import Home from './home';
import Signup from './signup';
import Login from './login';

const AppRouter = () => (
	<Router history={hashHistory}>
    <Route path="/" component={Layout}>
    	<Route path="home" component={Home} />
        <Route path="signup" component={Signup} />
        <Route path="login" component={Login} />
        <IndexRoute component={Home} />
    </Route>
    </Router>
);

export default AppRouter;