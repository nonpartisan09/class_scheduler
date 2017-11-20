import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { postData } from './sendData';
import Header from './Header';

import UserFormConstants from './UserFormConstants';

import FormData from './FormData';
import ProfileSchema from './schema/ProfileSchema';
import withUserForm from './withUserForm';

import './Header.css';
import './MyProfile.css';

const { UPDATE_PROFILE } = UserFormConstants;

const ignoredFields = [
  'terms_and_conditions',
  'contact_permission',
  'student',
  'teacher',
  'last_logged_in',
  'availabilities',
  'url_slug'
];

function handleUpdateProfile() {
  const { currentUser } = this.props;

  const updatedUser =  _.reduce(currentUser, (memo, value, key) => {
    if (key === 'thumbnail_image' || (!_.includes(ignoredFields, key) && !_.isEmpty(value) )) {
      memo[key] = value;
    }

    return memo;
  }, {});

  const attributes = FormData.from({ user: updatedUser });

  const requestParams = {
    url: '/update',
    attributes,
    method: 'POST',
    successCallBack: () => {
      this.setState({
        showSnackBar: true,
        showPassword: false,
        message: 'Success! Your profile has been updated.'
      });

      this.handleClearValues();

      setTimeout(() => {
        this.handleHideSnackBar();
      }, 2000);
    },

    errorCallBack: (message) => {
      this.setState({
        showSnackBar: true,
        message: message
      });
      this.resetForm();

      setTimeout(() => {
        this.handleHideSnackBar();
      }, 2000);
    }
  };

  return postData(requestParams);
}

class MyProfile extends Component {
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
    courses: PropTypes.array,
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
    courses: [],
    address: '',
    city: '',
    first_name: '',
    email: '',
    password: '',
    password_confirmation: '',
    thumbnail_image: '',
  },

};

const extraProps = { type: UPDATE_PROFILE, primaryButtonAction: handleUpdateProfile, primaryButtonLabel: 'Save changes' };

export default withUserForm(MyProfile, ProfileSchema, extraProps);
