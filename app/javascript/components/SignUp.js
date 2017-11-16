import React, { Component } from 'react';

import withUserForm from './withUserForm';
import Header from './Header';

import './SignUp.css';

import UserFormConstants from './UserFormConstants';

import SignUpSchema from './schema/SignUpSchema';
import { getData } from './sendData';

const { SIGN_UP } = UserFormConstants;

function handleUserSignUp() {
  const { currentUser } = this.props;
  const { match: { params: { role } } } = this.props;

  const requestParams = {
    url: `/sign_up/${role}`,
    jsonBody: { user: {...currentUser }},
    method: 'POST',
    successCallBack: () => {
      let link = '';

      if (role === 'volunteer') {
        link = '/availabilities/new';
      } else if (role === 'student' ) {
        link = '/search/';
      }
      location.assign(link);
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

  return sendData(requestParams);
}

class SignUp extends Component {
  render() {
    return (
      <div>
        <Header />

        <h1 className='signUpHeader'>
          Join Tutoria community: Step 1/2
        </h1>
      </div>
    );
  }
}

const extraProps =  { type: SIGN_UP, primaryButtonAction: handleUserSignUp, primaryButtonLabel:'Next Step (2/2)' };

export default withUserForm(SignUp, SignUpSchema, extraProps);

