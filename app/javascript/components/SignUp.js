import React, { Component } from 'react';
import _ from 'lodash';
import { FormattedMessage } from 'react-intl';

import FormData from './utils/FormData';
import withUserForm from './reusable/withUserForm';
import UserFormConstants from './utils/UserFormConstants';
import SignUpSchema from './schema/SignUpSchema';
import { postData } from './utils/sendData';
import formatLink from './utils/Link';
import SignUpSession from './utils/SignUpSession';
import PageHeader from './reusable/PageHeader';
import { gtag_formsent_conversion, opts } from './reusable/tracking';

const { SIGN_UP } = UserFormConstants;

const ignoredFields = [
  'current_password'
];

function handleUserSignUp() {
  const { match: { params: { role } } } = this.props;
  const { currentUser, currentUser: { locale } } = this.props;

  const updatedUser =  _.reduce(currentUser, (memo, value, key) => {
    if (key === 'thumbnail_image' || !_.isEmpty(value) || !_.includes(ignoredFields, key)) {
      memo[key] = value;
    }

    return memo;
  }, {});

  const attributes = FormData.from({ user: updatedUser });
  const restfulUrl = locale? `/${locale}/sign_up/${role}` : `/sign_up/${role}`;

  const requestParams = {
    url: restfulUrl,
    attributes,
    method: 'POST',
    successCallBack: () => {
      const userLocale = updatedUser.locale || '';
      let link = '';

      if (role === 'volunteer') {
        link = '/volunteer_sign_up_completed';
        window.location.href = formatLink(link, userLocale);
      } else if (role === 'client' ) {
        gtag_formsent_conversion(locale === 'en' ? opts.signup_en : opts.signup_es);
        link = '/search';
        const signupQuery = '?signup=true';
        window.location.href = formatLink(link + signupQuery, userLocale);
      }
    },

    errorCallBack: (message) => {
      this.setState({
        showSnackBar: true,
        message: message
      });

      setTimeout(() => {
        this.handleHideSnackBar();
      }, 2000);
    }
  };

  return postData(requestParams);
}

class SignUp extends Component {
  constructor(props) {
    super(props);

    this.clearSignUpSession = this.clearSignUpSession.bind(this);
  }
  clearSignUpSession() {
    if(SignUpSession.sessionExists()) {
      SignUpSession.clearSession();
    }
  }
  componentDidMount() {
    // Clear any sign up session data if the user leaves the sign up page
    window.addEventListener('beforeunload', this.clearSignUpSession);
  }
  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.clearSignUpSession);
  }
  
  render() {
    return (
      <div>
        <PageHeader title={ (
          <FormattedMessage
            id='SignUp.signUpHeader'
            defaultMessage='Join Tutoría community: Step 1/2'
           />
          ) }
         />
      </div>
    );
  }
}

const extraProps =  { type: SIGN_UP, primaryButtonAction: handleUserSignUp, primaryButtonLabel:'Next Step (2/2)' };

if(SignUpSession.sessionExists()) {
  extraProps.userData = SignUpSession.getSession();
}


export default withUserForm(SignUp, SignUpSchema, extraProps);

