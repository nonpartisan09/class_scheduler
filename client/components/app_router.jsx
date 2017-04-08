import React from 'react'
import {Router, Route, IndexRoute, hashHistory} from 'react-router'

import Layout from './layout'
import Home from './home'
import StudentSignup from './student_signup';
import VolunteerSignup from './volunteer_signup';
import Login from './login'
import VolunteerDashboard from './volunteer_dashboard'
import VolunteerProfile from './volunteer_profile'
import Classes from './classes'
import NewClassForm from './new_class_form'
import EditClassForm from './edit_class_form'

const AppRouter = () => (
	<Router history={hashHistory}>
    <Route path="/" component={Layout}>
    	<Route path="home" component={Home}/>
    	<Route path="sign_in" component={Login}/>
    	<Route path="student/signup" component={StudentSignup}/>
    	<Route path="volunteer/signup" component={VolunteerSignup}/>
    	<Route path="volunteer" component={VolunteerDashboard}>
            <Route path="profile" component={VolunteerProfile}/>
            <Route path="classes/new" component={NewClassForm}/>
            <Route path="classes/edit/:id" component={EditClassForm}/>
            <Route path="classes" component={Classes}/>
            <Route path="messages" component={VolunteerProfile}/>
        </Route>
    	<IndexRoute component={Home}/>
    </Route>
	</Router>
);

export default AppRouter;