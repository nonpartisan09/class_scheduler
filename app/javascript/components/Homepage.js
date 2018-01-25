import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

import Header from './reusable/Header';
import './utils/CheckMobile';

import './Homepage.css';
import Footer from './reusable/Footer';
import Programs from './Programs';
import Logo from './reusable/Logo';

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
        <div className='homepageWithoutFooter'>
          { this.renderDesktopHeader() }
          <div className='homepageContainer'>
            <div className='homepageTextContainer'>
              <div className='homepageCaption'>
                <div className='homepageCaptionTitle'>
                  <Logo />
                  <h2 className='homepageSubtitle'>
                    <FormattedMessage
                      id='Homepage.subtitle'
                      defaultMessage='Connect and share with our community of clients and volunteers'
                    />
                  </h2>
                </div>
                <Programs programs={ this.props.programs } />
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
              </div>
            </div>
            <img
              className='homepageImage'
              src='/assets/community_800.jpg'
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
        <Footer />
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


