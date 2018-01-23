import React from 'react';
import Joi from 'joi-browser';
import ReactJoiValidation from 'react-joi-validation';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

/* localization */

import { IntlProvider, addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import es from 'react-intl/locale-data/es';

import ReactDom from 'react-dom';

import MuiTheme from '../components/MuiTheme';

import Homepage from '../components/Homepage';
import SearchBar from '../components/SearchBar';

import ConversationIndexPage from '../components/ConversationIndexPage';
import NewMessagePage from '../components/NewMessagePage';
import MyProfile from '../components/MyProfile';
import SignUp from '../components/SignUp';
import SignIn from '../components/SignIn';
import NewPasswordPage from '../components/NewPasswordPage';
import ResetPasswordPage from '../components/ResetPasswordPage';
import NotFoundPage from '../components/NotFoundPage';

import TermsAndConditions from '../components/TermsAndConditions';
import NewAvailability from '../components/NewAvailability';
import AvailabilityIndexPage from '../components/AvailabilityIndexPage';
import UserProfile from '../components/UserProfile';
import ChooseLanguage from '../components/utils/ChooseLanguage';

import './application.css';

import localeData from '../../../build/locales/data.json';
import SearchResults from '../components/SearchResults';
import AboutPage from '../components/AboutPage';

addLocaleData([ ...en, ...es ]);
const language = ChooseLanguage();
const messages = localeData[language];

const { render }  = ReactDom;

ReactJoiValidation.setJoi(Joi);

document.addEventListener('turbolinks:load', () => {
  const container = document.getElementById('main');
  const node = document.getElementById('data');

  const data = node? JSON.parse(node.getAttribute('data')): {};

  const isUserSame = function(){
    if (data && data.currentUser && data && data.user && data.user) {
      return data.user.url_slug === data.currentUser.url_slug;
    }
  }();

  render(
    <IntlProvider locale={ language } messages={ messages }>
      <MuiThemeProvider muiTheme={ getMuiTheme(MuiTheme) }>
        <Router >
          <div>
            <Route exact path='/inbox' render={ (props) => <ConversationIndexPage { ...data } { ...props } /> } />
            <Route exact path='/messages/new' render={ (props) => <NewMessagePage { ...data } { ...props } /> } />
            <Switch>
              <Route path='/search/:sign_up' render={ (props) => <SearchBar { ...data } { ...props } /> } />
              <Route exact path='/search' render={ (props) => <SearchBar { ...data } { ...props } /> } />
            </Switch>
            <Route exact path='/available_volunteers' render={ (props) => <SearchResults { ...data } { ...props } /> } />
            <Route exact path='/my_profile' render={ (props) => <MyProfile { ...data } { ...props } /> } />
            <Route
              exact
              path='/profiles/:url_slug'
              render={ (props) => (
                isUserSame? (
                  <Redirect to='/' />
                ) : (
                  <UserProfile { ...data } { ...props } />
                )
              ) }
            />
            <Route exact path='/password/new' component={ NewPasswordPage } />
            <Route path='/password/edit' render={ (props) => <ResetPasswordPage { ...props } /> } />
            <Switch>
              <Route exact path='/availabilities/new/:sign_up' render={ (props) => <NewAvailability { ...data } { ...props } /> } />
              <Route exact path='/availabilities/new' render={ (props) => <NewAvailability { ...data } { ...props } /> } />
            </Switch>
            <Route exact path='/availabilities' render={ (props) => <AvailabilityIndexPage { ...data }  { ...props } /> } />

            <Route exact path='/' render={ () => <Homepage { ...data } /> } />
            <Route exact path='/about' render={ (props) => <AboutPage { ...data } { ...props } /> } />
            <Route exact path='/sign_in' component={ SignIn } />
            <Route exact path='/sign_up/:role' render={ (props) => <SignUp { ...data }  { ...props } /> } />
            <Route exact path='/terms_of_use' render={ (props) => <TermsAndConditions { ...data } { ...props } /> } />
            <Route path='/page_not_found' component={ NotFoundPage } />
          </div>
        </Router>

      </MuiThemeProvider>
    </IntlProvider>, container);
});
