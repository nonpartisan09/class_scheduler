import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import sendData from './sendData';
import Header from './Header';

import UserFormConstants from './UserFormConstants';

import './Header.css';
import './MyProfile.css';
import ProfileSchema from './schema/ProfileSchema';
import withUserForm from './withUserForm';

const { UPDATE_PROFILE } = UserFormConstants;

function handleUpdateProfile() {
  const { currentUser, currentUser: { courses } } = this.props;

  const newUser = _.omit(currentUser, [ 'courses', 'terms_and_conditions', 'contact_permission', 'student', 'teacher' ]);
  const newCourses = _.map(courses, ({ id })=> { return id; });

  const requestParams = {
    url: '/update',
    jsonBody: { user: { ...newUser, courses: newCourses } },
    method: 'PUT',
    successCallBack: () => {
      this.setState({
        showSnackBar: true,
        showPassword: false,
        message: 'Success! Your profile has been updated'
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

  return sendData(requestParams);
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
  },

};

const extraProps = { type: UPDATE_PROFILE, primaryButtonAction: handleUpdateProfile, primaryButtonLabel: 'Save changes' };

export default withUserForm(MyProfile, ProfileSchema, extraProps);
