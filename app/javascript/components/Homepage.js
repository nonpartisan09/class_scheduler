import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import Courses from './Courses';
import Header from './Header';
import './utils/CheckMobile';

import './Homepage.css';

class Homepage extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignUpClient = this.handleSignUpClient.bind(this);
    this.handleSignUpVolunteer = this.handleSignUpVolunteer.bind(this);

  }
  render() {
    return (
      <div>
        { this.renderDesktopNavigation() }
        <div className='homepageContainer'>
          <img
            className='homepageImage'
            src={ '/assets/community_2000.jpg' }
            alt='Learn and teach community'
            srcSet={ ` ${'/assets/community_200.jpg'} 200w,
            ${'/assets/community_400.jpg'} 400w,
            ${'/assets/community_600.jpg'} 600w,
            ${'/assets/community_800.jpg'} 800w,
            ${'/assets/community_1000.jpg'} 1000w,
            ${'/assets/community_1500.jpg'} 1500w,
            ${'/assets/community_2000.jpg'} 2000w,
            ${'/assets/community_2000.jpg'} 2000w,
            ${'/assets/community_4000.jpg'} 4000w` }
          />
          <div className='mask'>
            <h1>
              <img className='logo' alt='tutoria logo' src={ '/assets/tutoria_logo_light_blue_and_white_web.png' } />
            </h1>
            <h2 className='subtitle'>
              Connect and share with our community of clients and teachers
            </h2>
          </div>
        </div>

        { this.renderMobileNavigation() }

        <Courses courses={ this.props.courses } />
      </div>
    );
  }

  renderDesktopNavigation() {
      if (!window.mobilecheck()) {
      return (
        <Header currentUser={ this.props.currentUser } />
      );
    }
  }

  renderMobileNavigation() {
    if (window.mobilecheck() && _.isEmpty(this.props.currentUser)) {
      return [
        <h2 key={ 0 } className='mobileSubtitle'>
          Connect and share
        </h2>,
        <div key={ 1 } className='homepageMobileNavigation' >
          <RaisedButton primary fullWidth label='Sign in' onClick={ this.handleSignIn } />
          <FlatButton primary fullWidth label='Sign up as a volunteer' onClick={ this.handleSignUpVolunteer } />
          <FlatButton primary fullWidth label='Sign up as a client' onClick={ this.handleSignUpClient } />
        </div>
      ];
    }
  }

  handleSignIn() {
    location.assign('/sign_in');
  }

  handleSignUpVolunteer() {
    location.assign('/sign_up/volunteer');
  }

  handleSignUpClient() {
    location.assign('/sign_up/client');
  }
}

Homepage.propTypes = {
  courses: PropTypes.array,
  currentUser: PropTypes.object,
};

Homepage.defaultProps = {
  courses: [],
  currentUser: { }
};

export default Homepage;


