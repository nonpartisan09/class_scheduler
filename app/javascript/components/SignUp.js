import React, { Component } from 'react';
import _ from 'lodash';
import { FormattedMessage } from 'react-intl';

import FormData from './utils/FormData';
import withUserForm from './reusable/withUserForm';
import UserFormConstants from './utils/UserFormConstants';
import SignUpSchema from './schema/SignUpSchema';
import { postData } from './utils/sendData';
import formatLink from './utils/Link';
import PageHeader from './reusable/PageHeader';
import NonChromeMessage from './reusable/NonChromeMessage';

const { SIGN_UP } = UserFormConstants;

const ignoredFields = [
  'current_password'
];

function handleUserSignUp() {
  const { match: { params: { role } }, history } = this.props;
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
    successCallBack: ({ currentUser, days }) => {
      const userLocale = updatedUser.locale || '';
      let link = '';

      if (role === 'volunteer') {
        link = '/volunteer_sign_up_completed';
        window.location.href = formatLink(link, userLocale);
      } else if (role === 'client' ) {
        link = '/search';
        history.push(formatLink(link, userLocale), { signUp: true, currentUser, days });
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

  render() {
    return (
      <div>
        <NonChromeMessage/>
        <PageHeader title={
          <FormattedMessage
            id='SignUp.signUpHeader'
            defaultMessage='Join Tutoría community: Step 1/2'
           />
         }
         />
      </div>
    );
  }
}

const extraProps =  { type: SIGN_UP, primaryButtonAction: handleUserSignUp, primaryButtonLabel:'Next Step (2/2)' };

export default withUserForm(SignUp, SignUpSchema, extraProps);

