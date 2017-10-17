import React from 'react';
import Joi from 'joi-browser';
import ReactJoiValidation from 'react-joi-validation';

import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';

import ReactDom from 'react-dom';
const { render }  = ReactDom;

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
ReactJoiValidation.setJoi(Joi);

import Homepage from '../components/Homepage';
import SearchBar from '../components/SearchBar';
import MyProfile from '../components/MyProfile';
import SignUp from '../components/SignUp';
import SignIn from '../components/SignIn';
import TermsAndConditions from '../components/TermsAndConditions';
import NewAvailability from '../components/NewAvailability';
import AvailabilityIndexPage from '../components/AvailabilityIndexPage';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('main');
  const node = document.getElementById('data');

  const data = node? JSON.parse(node.getAttribute('data')): {};
  console.log('dom content');

  render(
    <MuiThemeProvider >
      <Router >
        <div>
          <Route exact path='/' render={() => <Homepage {...data } /> } />
          <Route exact path='/search' render={() => <SearchBar {...data } /> } />
          <Route exact path='/my_profile' render={(props) => <MyProfile {...data } { ...props } /> } />
          <Route exact path='/sign_up/:role' render={(props) => <SignUp {...data}  {...props } /> } />
          <Route exact path='/sign_in' component={ SignIn } />
          <Route exact path='/terms_and_conditions' component={ TermsAndConditions } />
          <Route exact path='/availabilities/new' render={(props) => <NewAvailability {...data } { ...props } /> } />
          <Route exact path='/availabilities' render={(props) => <AvailabilityIndexPage {...data }  {...props } /> } />
        </div>
      </Router>
    </MuiThemeProvider>, container);
});

document.addEventListener('turbolinks:render', () => {
  const container = document.getElementById('main');
  const node = document.getElementById('data');

  const data = node? JSON.parse(node.getAttribute('data')): {};
  console.log('dom content');

  render(
    <MuiThemeProvider >
      <Router >
        <div>
          <Route exact path='/' render={() => <Homepage {...data } /> } />
          <Route exact path='/search' render={() => <SearchBar {...data } /> } />
          <Route exact path='/my_profile' render={(props) => <MyProfile {...data } { ...props } /> } />
          <Route exact path='/sign_up/:role' render={(props) => <SignUp {...data}  {...props } /> } />
          <Route exact path='/sign_in' component={ SignIn } />
          <Route exact path='/terms_and_conditions' component={ TermsAndConditions } />
          <Route exact path='/availabilities/new' render={(props) => <NewAvailability {...data } { ...props } /> } />
          <Route exact path='/availabilities' render={(props) => <AvailabilityIndexPage {...data }  {...props } /> } />
        </div>
      </Router>
    </MuiThemeProvider>, container);
});
