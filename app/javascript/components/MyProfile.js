import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { FormattedMessage } from 'react-intl';

import { postData } from './sendData';
import Header from './Header';

import UserFormConstants from './UserFormConstants';

import FormData from './utils/FormData';
import ProfileSchema from './schema/ProfileSchema';
import withUserForm from './withUserForm';
import newUser from './utils/CheckUpdatedFields';

import './Header.css';

const { UPDATE_PROFILE } = UserFormConstants;

const ignoredFields = [
  'client',
  'volunteer',
  'last_logged_in',
  'availabilities',
  'url_slug'
];

function handleUpdateProfile() {
  const { currentUser } = this.props;
  const { user } = this.state;

  const updatedUser = newUser(currentUser, user, ignoredFields);

  if(_.size(updatedUser) > 0) {
    const attributes = FormData.from({ user: updatedUser });

    const requestParams = {
      url: '/update',
      attributes,
      method: 'POST',
      successCallBack: () => {
        this.setState({
          showSnackBar: true,
          showPassword: false,
          message: <FormattedMessage id='Profile.success' defaultMessage='Success! Your profile has been updated' />
        });

        this.handleClearValues();

        setTimeout(() => {
          this.handleHideSnackBar();
        }, 2000);
      },

      errorCallBack: (message) => {
        this.setState({
          showSnackBar: true,
          message
        });
        this.resetForm();

        setTimeout(() => {
          this.handleHideSnackBar();
        }, 2000);
      }
    };

    return postData(requestParams);
  } else {
    this.setState({
      showSnackBar: true,
      showPassword: false,
      message: <FormattedMessage id='Profile.noChangeDetected' defaultMessage='Please make a change to your profile first' />
    });

    setTimeout(() => {
      this.handleHideSnackBar();
    }, 2000);
  }
}

class MyProfile extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      user: props.currentUser
    };
  }

  render() {
    return (
      <div>
        <Header currentUser={ this.props.currentUser } />
      </div>
    );
  }
}

MyProfile.propTypes = {
  currentUser: PropTypes.shape({
    programs: PropTypes.array,
    first_name: PropTypes.string,
    address: PropTypes.string,
    city: PropTypes.string,
    email: PropTypes.string,
    password: PropTypes.string,
    password_confirmation: PropTypes.string,
    thumbnail_image: PropTypes.oneOfType([ PropTypes.string, PropTypes.object ]),
  }),

};

MyProfile.defaultProps = {
  currentUser: {
    programs: [],
    address: '',
    city: '',
    first_name: '',
    email: '',
    password: '',
    password_confirmation: '',
    thumbnail_image: '',
  },

};

const extraProps = { type: UPDATE_PROFILE, primaryButtonAction: handleUpdateProfile, primaryButtonLabel: <FormattedMessage id='saveChanges' defaultMessage='Save changes' /> };

export default withUserForm(MyProfile, ProfileSchema, extraProps);
