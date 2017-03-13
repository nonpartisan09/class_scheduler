import React from 'react'
import {Router, Route} from 'react-router'
import {ConnectedRouter} from 'react-router-redux'

const Placeholder = () => <div>Hello</div>

const AppRouter = ({history}) => (
	<ConnectedRouter history={history}>
		<Route path="/" component={Placeholder}/>
	</ConnectedRouter>
);

export default AppRouter;