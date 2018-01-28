import React, { Component } from 'react';
import _ from 'lodash';
import { FormattedMessage } from 'react-intl';

import FormData from './utils/FormData';
import withUserForm from './reusable/withUserForm';
import Header from './reusable/Header';

import './SignUp.css';

import UserFormConstants from './utils/UserFormConstants';

import SignUpSchema from './schema/SignUpSchema';
import { postData } from './utils/sendData';
import formatLink from './utils/Link';

const { SIGN_UP } = UserFormConstants;

const ignoredFields = [
  'current_password'
];

function handleUserSignUp() {
  const { match: { params: { role } }, history } = this.props;
  const { currentUser } = this.props;

  const updatedUser =  _.reduce(currentUser, (memo, value, key) => {
    if (key === 'thumbnail_image' || !_.isEmpty(value) || !_.includes(ignoredFields, key)) {
      memo[key] = value;
    }

    return memo;
  }, {});

  const attributes = FormData.from({ user: updatedUser });

  const requestParams = {
    url: `/sign_up/${role}`,
    attributes,
    method: 'POST',
    successCallBack: () => {
      let link = '';

      if (role === 'volunteer') {
        link = '/availabilities/new';
      } else if (role === 'client' ) {
        link = '/search';
      }

      const userLocale = updatedUser.locale || '';

      history.push(formatLink(link, userLocale), { signUp: true });
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

  render() {
    return (
      <div>
        <Header />

        <h1 className='signUpHeader'>
          <FormattedMessage
            id='SignUp.signUpHeader'
            defaultMessage='Join Tutoria community: Step 1/2'
          />
        </h1>
      </div>
    );
  }
}

const extraProps =  { type: SIGN_UP, primaryButtonAction: handleUserSignUp, primaryButtonLabel:'Next Step (2/2)' };

export default withUserForm(SignUp, SignUpSchema, extraProps);

