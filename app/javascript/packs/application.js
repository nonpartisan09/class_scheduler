import React from 'react';
import Joi from 'joi-browser';
import ReactJoiValidation from 'react-joi-validation';

import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import ReactDom from 'react-dom';

import MuiTheme from '../components/MuiTheme';

import Homepage from '../components/Homepage';
import SearchBar from '../components/SearchBar';
import MyProfile from '../components/MyProfile';
import SignUp from '../components/SignUp';
import SignIn from '../components/SignIn';
import TermsAndConditions from '../components/TermsAndConditions';
import NewAvailability from '../components/NewAvailability';
import AvailabilityIndexPage from '../components/AvailabilityIndexPage';
import UserProfile from '../components/UserProfile';
import './application.css';

const { render }  = ReactDom;

ReactJoiValidation.setJoi(Joi);

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('main');
  const node = document.getElementById('data');

  const data = node? JSON.parse(node.getAttribute('data')): {};

  render(
    <MuiThemeProvider muiTheme={ getMuiTheme(MuiTheme) }>
      <Router >
        <div>
          <Route exact path='/' render={ () => <Homepage { ...data } /> } />
          <Route exact path='/search' render={ () => <SearchBar { ...data } /> } />
          <Switch>
            <Route path='/search/:sign_up' render={ (props) => <SearchBar { ...data } { ...props } /> } />
            <Route exact path='/search' render={ (props) => <SearchBar { ...data } { ...props } /> } />
          </Switch>
          <Route exact path='/my_profile' render={ (props) => <MyProfile { ...data } { ...props } /> } />
          <Route exact path='/profiles/:url_slug' render={ (props) => <UserProfile { ...data } { ...props } /> } />
          <Route exact path='/sign_up/:role' render={ (props) => <SignUp { ...data }  { ...props } /> } />
          <Route exact path='/sign_in' component={ SignIn } />
          <Route exact path='/terms_and_conditions' component={ TermsAndConditions } />
          <Switch>
            <Route exact path='/availabilities/new/:sign_up' render={ (props) => <NewAvailability { ...data } { ...props } /> } />
            <Route exact path='/availabilities/new' render={ (props) => <NewAvailability { ...data } { ...props } /> } />
          </Switch>
          <Route exact path='/availabilities' render={ (props) => <AvailabilityIndexPage { ...data }  { ...props } /> } />
        </div>
      </Router>
    </MuiThemeProvider>, container);
});

document.addEventListener('turbolinks:render', () => {
  const container = document.getElementById('main');
  const node = document.getElementById('data');

  const data = node? JSON.parse(node.getAttribute('data')): {};

  render(
    <MuiThemeProvider muiTheme={ getMuiTheme(MuiTheme) }>
      <Router >
        <div>
          <Route exact path='/' render={ () => <Homepage { ...data } /> } />
          <Switch>
            <Route path='/search/:sign_up' render={ (props) => <SearchBar { ...data } { ...props } /> } />
            <Route exact path='/search' render={ (props) => <SearchBar { ...data } { ...props } /> } />
          </Switch>
          <Route exact path='/my_profile' render={ (props) => <MyProfile { ...data } { ...props } /> } />
          <Route exact path='/profiles/:url_slug' render={ (props) => <UserProfile { ...data } { ...props } /> } />
          <Route exact path='/sign_up/:role' render={ (props) => <SignUp { ...data }  { ...props } /> } />
          <Route exact path='/sign_in' component={ SignIn } />
          <Route exact path='/terms_and_conditions' component={ TermsAndConditions } />
          <Switch>
            <Route exact path='/availabilities/new/:sign_up' render={ (props) => <NewAvailability { ...data } { ...props } /> } />
            <Route exact path='/availabilities/new' render={ (props) => <NewAvailability { ...data } { ...props } /> } />
          </Switch>
          <Route exact path='/availabilities' render={ (props) => <AvailabilityIndexPage { ...data }  { ...props } /> } />
        </div>
      </Router>
    </MuiThemeProvider>, container);
});
