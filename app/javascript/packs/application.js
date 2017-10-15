import React from 'react';
import Joi from 'joi-browser';
import ReactJoiValidation from 'react-joi-validation';

import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';

import { render } from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
ReactJoiValidation.setJoi(Joi);

import Homepage from '../components/Homepage';
import SearchBar from '../components/SearchBar';
import MyProfile from '../components/MyProfile';
import SignUp from '../components/SignUp';
import TermsAndConditions from '../components/TermsAndConditions';
import NewAvailability from '../components/NewAvailability';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('main');
  const node = document.getElementById('data');

  const data = JSON.parse(node.getAttribute('data'));
  console.log("DOM fully loaded and parsed");

  render(
    <MuiThemeProvider >
     <Router >
        <div>
          <Route exact path="/" render={() => <Homepage {...data } /> }/>
          <Route path="/search" render={() => <SearchBar {...data } /> } />
          <Route path="/my_profile" render={() => <MyProfile {...data } /> } />
          <Route path="/sign_up/:role" render={(props) => <SignUp {...data}  {...props } /> } />
          <Route path="/terms_and_conditions" component={ TermsAndConditions } />
          <Route path="/availabilities/new" component={ NewAvailability } />
        </div>
      </Router>
    </MuiThemeProvider>, container);
});
