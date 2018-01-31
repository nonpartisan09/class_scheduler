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
import ChooseLanguage from '../components/utils/ChooseLanguage';
import localeData from '../../../build/locales/data.json';
import { ENGLISH, SPANISH } from '../components/utils/availableLocales';

import asyncComponent from '../components/asyncComponent';
import './application.css';
import Homepage from '../components/Homepage';

const Search = asyncComponent(() => import('../components/SearchBar')
  .then(module => module.default), { name: 'Search' });
const Inbox = asyncComponent(() => import('../components/ConversationIndexPage')
  .then(module => module.default), { name: 'Inbox' });
const NewMessage = asyncComponent(() => import('../components/NewMessagePage')
  .then(module => module.default), { name: 'NewMessage' });
const MyProfile = asyncComponent(() => import('../components/MyProfile')
  .then(module => module.default), { name: 'MyProfile' });
const SignUp = asyncComponent(() => import('../components/SignUp')
  .then(module => module.default), { name: 'SignUp' });
const SignIn = asyncComponent(() => import('../components/SignIn')
  .then(module => module.default), { name: 'SignIn' });
const NewPasswordPage = asyncComponent(() => import('../components/NewPasswordPage')
  .then(module => module.default), { name: 'NewPasswordPage' });
const ResetPasswordPage = asyncComponent(() => import('../components/ResetPasswordPage')
  .then(module => module.default), { name: 'ResetPasswordPage' });
const NotFoundPage = asyncComponent(() => import('../components/NotFoundPage')
  .then(module => module.default), { name: 'NotFoundPage' });
const TermsAndConditions = asyncComponent(() => import('../components/TermsAndConditions')
  .then(module => module.default), { name: 'TermsAndConditions' });
const NewAvailability = asyncComponent(() => import('../components/NewAvailability')
  .then(module => module.default), { name: 'NewAvailability' });
const UserProfile = asyncComponent(() => import('../components/UserProfile')
  .then(module => module.default), { name: 'UserProfile' });
const SearchResults = asyncComponent(() => import('../components/SearchResults')
  .then(module => module.default), { name: 'SearchResults' });
const AboutPage = asyncComponent(() => import('../components/AboutPage')
  .then(module => module.default), { name: 'AboutPage' });
const ConversationPage = asyncComponent(() => import('../components/ConversationPage')
  .then(module => module.default), { name: 'ConversationPage' });
const UserReviewIndexPage = asyncComponent(() => import('../components/UserReviewIndexPage')
  .then(module => module.default), { name: 'UserReviewIndexPage' });
const AvailabilityIndexPage = asyncComponent(() => import('../components/AvailabilityIndexPage')
  .then(module => module.default), { name: 'AvailabilityIndexPage' });

addLocaleData([ ...en, ...es ]);

const language = ChooseLanguage();
const messages = localeData[language];

const { render }  = ReactDom;

ReactJoiValidation.setJoi(Joi);

function renderUserProfile(data, props) {
  const isUserSame = function(){
    if (data && data.currentUser && data && data.user && data.user) {
      return data.user.url_slug === data.currentUser.url_slug;
    }
  }();

  if (isUserSame) {
    return <Redirect to='/' />;
  } else {
    return <UserProfile { ...data } { ...props } />;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('main');
  const node = document.getElementById('data');

  const data = node? JSON.parse(node.getAttribute('data')): {};
  const locale = `(${ENGLISH}|${SPANISH})`;

  render(
    <IntlProvider locale={ language } messages={ messages }>
      <MuiThemeProvider muiTheme={ getMuiTheme(MuiTheme) }>
        <Router >
          <Switch>

            <Route exact path={ `/${locale}` } render={ () => <Homepage { ...data } /> } />

            <Route exact path={ `/${locale}/inbox` } render={ (props) => <Inbox { ...data } { ...props } /> } />
            <Route exact path={ `/${locale}/inbox/:id` } render={ (props) => <ConversationPage { ...data } { ...props } /> } />
            <Route exact path={ `/${locale}/messages/new` } render={ (props) => <NewMessage { ...data } { ...props } /> } />
            <Route exact path={ `/${locale}/search` } render={ (props) => <Search { ...data } { ...props } /> } />
            <Route exact path={ `/${locale}/volunteers` } render={ (props) => <SearchResults { ...data } { ...props } /> } />
            <Route exact path={ `/${locale}/my_profile` } render={ (props) => <MyProfile { ...data } { ...props } /> } />
            <Route exact path={ `/${locale}/:user_id/(:order)` } render={ (props) => <UserReviewIndexPage { ...data } { ...props } /> } />
            <Route exact path={ `/${locale}/reviews/author/:url_slug` } render={ (props) => <UserReviewIndexPage { ...data } { ...props } /> } />

            <Route
              exact
              path={ `/${locale}/profiles/:url_slug` }
              render={ (props) => (renderUserProfile (data, props)) }
            />
            <Route exact path={ `/${locale}/password/new` } component={ NewPasswordPage } />
            <Route exact path={ `/${locale}/password/edit` } render={ (props) => <ResetPasswordPage { ...props } /> } />
            <Route exact path={ `/${locale}/availabilities/new` } render={ (props) => <NewAvailability { ...data } { ...props } /> } />
            <Route exact path={ `/${locale}/availabilities` } render={ (props) => <AvailabilityIndexPage { ...data }  { ...props } /> } />

            <Route exact path={ `/${locale}/about` } render={ (props) => <AboutPage { ...data } { ...props } /> } />
            <Route exact path={ `/${locale}/sign_in` } component={ SignIn } />
            <Route exact path={ `/${locale}/sign_up/:role` } render={ (props) => <SignUp { ...data }  { ...props } /> } />
            <Route exact path={ `/${locale}/terms_of_use` } render={ (props) => <TermsAndConditions { ...data } { ...props } /> } />

            <Route exact path='/' render={ () => <Homepage { ...data } /> } />
            <Route exact path='/inbox' render={ (props) => <Inbox { ...data } { ...props } /> } />
            <Route exact path='/inbox/:id' render={ (props) => <ConversationPage { ...data } { ...props } /> } />
            <Route exact path='/messages/new' render={ (props) => <NewMessage { ...data } { ...props } /> } />
            <Route exact path='/search' render={ (props) => <Search { ...data } { ...props } /> } />
            <Route exact path='/volunteers' render={ (props) => <SearchResults { ...data } { ...props } /> } />
            <Route exact path='/my_profile' render={ (props) => <MyProfile { ...data } { ...props } /> } />
            <Route exact path='/reviews/author/:url_slug' render={ (props) => <UserReviewIndexPage { ...data } { ...props } /> } />

            <Route
              exact
              path='/profiles/:url_slug'
              render={ (props) => (renderUserProfile (data, props)) }
            />
            <Route exact path='/password/new' component={ NewPasswordPage } />
            <Route exact path='/password/edit' render={ (props) => <ResetPasswordPage { ...props } /> } />
            <Route exact path='/availabilities/new' render={ (props) => <NewAvailability { ...data } { ...props } /> } />
            <Route exact path='/availabilities' render={ (props) => <AvailabilityIndexPage { ...data }  { ...props } /> } />

            <Route exact path='/about' render={ (props) => <AboutPage { ...data } { ...props } /> } />
            <Route exact path='/sign_in' component={ SignIn } />
            <Route exact path='/sign_up/:role' render={ (props) => <SignUp { ...data }  { ...props } /> } />
            <Route exact path='/terms_of_use' render={ (props) => <TermsAndConditions { ...data } { ...props } /> } />

            <Route path='/*' render={ () => <NotFoundPage { ...data } /> } />
          </Switch>
        </Router>

      </MuiThemeProvider>
    </IntlProvider>, container);
});
