import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

import Header from './reusable/Header';
import './utils/CheckMobile';

import Footer from './reusable/Footer';
import NonChromeMessage from './reusable/NonChromeMessage';

class Homepage extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignUpClient = this.handleSignUpClient.bind(this);
    this.handleSignUpVolunteer = this.handleSignUpVolunteer.bind(this);

  }
  render() {
    return (
      <div className='homepageMainContainer'>
        <NonChromeMessage />
        <Header currentUser={ this.props.currentUser } />
        <Footer currentUser={ this.props.currentUser } />
      </div>
    );
  }

  renderDesktopHeader() {
    return (
      <div className='homepageMobileHeader'>
        <Header currentUser={ this.props.currentUser } />
      </div>
    );
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
  currentUser: PropTypes.object,
  programs: PropTypes.array
};

Homepage.defaultProps = {
  currentUser: { },
  programs: []
};

export default Homepage;


