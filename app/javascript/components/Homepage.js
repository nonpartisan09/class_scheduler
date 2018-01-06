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
      <div className='homepageMainContainer'>
        { this.renderDesktopHeader() }
        <div className='homepageContainer'>
          <div className='homepageTextContainer'>
            <div className='homepageCaption'>
              <h1 className='homepageCaptionItem'>
                <img
                  className='logo'
                  alt='tutoria logo'
                  src='/assets/tutoria_logo_full color_web.png'
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
            <div className='homepageListContainer'>
              <h3>
                <FormattedMessage
                  id='Homepage.list'
                  defaultMessage='How this free service works:'
               />
              </h3>

              <ul className='homepageList'>
                <li className='homepageListItem'>
                  <FormattedMessage
                    id='Homepage.listItem1'
                    defaultMessage='Clients post what they need help with, such as English language tutoring.'
                 />
                </li>
                <li className='homepageListItem'>
                  <FormattedMessage
                    id='Homepage.listItem2'
                    defaultMessage='Volunteers post what they can help with.'
                 />
                </li>
                <li className='homepageListItem'>
                  <FormattedMessage
                    id='Homepage.listItem3'
                    defaultMessage='Clients contact volunteers matching their needs and availability.'
                 />
                </li>
                <li className='homepageListItem'>
                  <FormattedMessage
                    id='Homepage.listItem4'
                    defaultMessage='After working together, volunteers and clients review each other.'
                 />
                </li>
              </ul>
              <FormattedMessage
                id='Homepage.question'
                defaultMessage='Questions? Email us at'
             />
              {' '}
              <a className='homepageMailToLink' href='mailto:admin@tutoria.io' target='_blank' rel='noopener noreferrer'>
                admin@tutoria.io
              </a>
            </div>
            { this.renderMobileNavigation() }
          </div>
          <img
            className='homepageImage'
            src='/assets/community_2000.jpg'
            alt='Learn and help community'
            srcSet={
              `${'/assets/community_200.jpg'} 200w,
               ${'/assets/community_400.jpg'} 400w,
               ${'/assets/community_600.jpg'} 600w,
               ${'/assets/community_800.jpg'} 800w`
            }
          />
        </div>

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
            <RaisedButton
              primary
              label={
                <FormattedMessage
                  id='signIn'
                  defaultMessage='Sign in'
                />
              }
              onClick={ this.handleSignIn }
            />
          </div>
          <div className='homepageButton'>
            <FlatButton
              className='homepageButton'
              primary
              onClick={ this.handleSignUpVolunteer }
              label={
                <FormattedMessage
                  id='signUpVolunteer'
                />
              }
            />
          </div>
          <div className='homepageButton'>
            <FlatButton
              className='homepageButton'
              primary
              onClick={ this.handleSignUpClient }
              label={
                <FormattedMessage
                  id='signUpClient'
                  defaultMessage='Sign up as a client'
                />
              }
            />
          </div>
        </div>
      ];
    }
  }

  renderMobileNavigation() {
    if (_.isEmpty(this.props.currentUser)) {
      return [
        <div key={ 1 } className='homepageMobileNavigation' >
          <RaisedButton
            primary
            fullWidth
            onClick={ this.handleSignIn }
            label={
              <FormattedMessage
                id='signIn'
              />
            }
          />

          <FlatButton
            primary
            fullWidth
            onClick={ this.handleSignUpVolunteer }
            label={
              <FormattedMessage
                id='signUpVolunteer'
              />
            }
          />

          <FlatButton
            primary
            fullWidth
            onClick={ this.handleSignUpClient }
            label={
              <FormattedMessage
                id='signUpClient'
              />
            }
          />
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
  currentUser: PropTypes.object,
};

Homepage.defaultProps = {
  currentUser: { }
};

export default Homepage;


