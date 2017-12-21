import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { FormattedMessage } from 'react-intl';

import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

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
        { this.renderDesktopHeader() }
        <div className='homepageContainer'>
          <div className='homepageCaption'>
            <h1 className='homepageCaptionItem'>
              <img
                className='logo'
                alt='tutoria logo'
                src={ '/assets/tutoria_logo_full color_web.png' }
              />
            </h1>
            <h2 className='homepageCaptionItem homepageSubtitle'>
              <FormattedMessage
                id='Homepage.subtitle'
                defaultMessage='Connect and share with our community of clients and volunteers'
              />
            </h2>
            { this.renderDesktopNavigation() }
          </div>
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
            ${'/assets/community_2000.jpg'} 2000w` }
          />

          { this.renderMobileNavigation() }
        </div>
        <main className='homepageMainContainer'>

          <h3>
            <FormattedMessage
              id='Homepage.list'
              defaultMessage='How this free service works:'
            />
          </h3>

          <ul className='homepageMainList'>
            <li className='homepageMainListItem'>
              <FormattedMessage
                id='Homepage.listItem1'
                defaultMessage='Clients post what they need help with, such as English language tutoring.'
              />
            </li>
            <li className='homepageMainListItem'>
              <FormattedMessage
                id='Homepage.listItem2'
                defaultMessage='Volunteers post what they can help with.'
              />
            </li>
            <li className='homepageMainListItem'>
              <FormattedMessage
                id='Homepage.listItem3'
                defaultMessage='Clients contact volunteers matching their needs and availability.'
              />
            </li>
            <li className='homepageMainListItem'>
              <FormattedMessage
                id='Homepage.listItem4'
                defaultMessage='After working together, volunteers and clients review each other.'
              />
            </li>
          </ul>
          <FormattedMessage
            id='Homepage.question'
            defaultMessage='Questions? Email us at '
          />
          <a className="homepageMailToLink" href="mailto:admin@tutoria.io" target="_blank" rel='noopener noreferrer'>
            admin@tutoria.io
          </a>
        </main>
      </div>
    );
  }

  renderDesktopHeader() {
    if (!_.isEmpty(this.props.currentUser)) {
      return (
        <div className='homepageMobileHeader'>
          <Header currentUser={ this.props.currentUser } />
        </div>
      );
    }
  }

  renderDesktopNavigation() {
    if (!window.mobilecheck() && _.isEmpty(this.props.currentUser)) {
      return [
        <div key={ 1 } className='homepageCaptionItem homepageDesktopNavigation' >
          <div className='homepageButton'>
            <RaisedButton primary label='Sign in' onClick={ this.handleSignIn } />
          </div>
          <div className='homepageButton'>
            <FlatButton className='homepageButton' primary onClick={ this.handleSignUpVolunteer } >
              <FormattedMessage
                id='signUpVolunteer'
                defaultMessage='Sign up as a volunteer'
              />
            </FlatButton>
          </div>
          <div className='homepageButton'>
            <FlatButton className='homepageButton' primary label='Sign up as a client' onClick={ this.handleSignUpClient } >
              <FormattedMessage
                id='signUpClient'
                defaultMessage='Sign up as a client'
              />
            </FlatButton>
          </div>
        </div>
      ];
    }
  }

  renderMobileNavigation() {
    if (_.isEmpty(this.props.currentUser)) {
      return [
        <div key={ 1 } className='homepageMobileNavigation' >
          <RaisedButton primary fullWidth label='Sign in' onClick={ this.handleSignIn } />
          <FlatButton primary fullWidth onClick={ this.handleSignUpVolunteer } >
            <FormattedMessage
              id='signUpVolunteer'
              defaultMessage='Sign up as a volunteer'
            />
          </FlatButton>
          <FlatButton primary fullWidth onClick={ this.handleSignUpClient } >
            <FormattedMessage
              id='signUpClient'
              defaultMessage='Sign up as a client'
            />
          </FlatButton>
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
  programs: PropTypes.array,
  currentUser: PropTypes.object,
};

Homepage.defaultProps = {
  programs: [],
  currentUser: { }
};

export default Homepage;


