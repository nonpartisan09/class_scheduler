import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Toolbar,
  AppBar
} from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { 
  FaFacebookF,
  FaRegCopyright,
  FaLinkedin,
  FaEnvelope,
  FaPhone
} from 'react-icons/fa';

import formatLink from '../utils/Link';
import PaypalButton from '../PaypalButton';
import contactInfo from '../../ContactInfo';

class Footer extends Component {

  render() {
    return (
      <AppBar
        position='relative'
        classes={ { root: 'footerAppBar' } }
      >
        <Toolbar
          classes={ { root: 'footerToolbar' } }
        >
          { this.renderLeftElements() }
          <PaypalButton />
        </Toolbar>
      </AppBar>
    );
  }

  renderLeftElements() {
    const { currentUser: { locale } } = this.props;
    const size = 20;

    return(
      <span className='leftElementsContainer'>
        <h3 className='footerHeader'>
          Tutoria
          { ' ' }
          <span className='copyrightAndLogo'>
            Copyright
            { <FaRegCopyright className='copyrightLogo' /> }
            2019 Tutoria, Inc.
          </span>
        </h3>
        <span className='footerBody'>
          <div>
            <span className='footerLinks'>
              <b>
                <FormattedMessage
                  id='Footer.usefulLinks'
                  defaultMessage='Useful Links'
                />
              </b>
              <a href={ formatLink('/about', locale) }>
                <FormattedMessage
                  id='aboutPage'
                  defaultMessage='About'
                />
              </a>
              <a href={ formatLink('/faq', locale) }>
                <FormattedMessage
                  id='FAQPage'
                  defaultMessage='FAQ'
                />
              </a>
              <a href={ formatLink('/terms_of_use', locale) }>
                <FormattedMessage
                  id='Footer.TAC'
                  defaultMessage='Terms & Conditions'
                />
              </a>
            </span>
            <span className='socialMediaLinks'>
              <b>
                <FormattedMessage
                  id='Footer.socialMedia'
                  defaultMessage='Social Media'
                />
              </b>
              <a 
                href={ contactInfo.FACEBOOK }
                rel='noopener noreferrer' 
                target='_blank'
              >
                <FaFacebookF
                  size={ size }
                  className='facebookIcon'
                />
                Facebook
              </a>
              <a 
                href={ contactInfo.LINKEDIN }  
                rel='noopener noreferrer' 
                target='_blank'
              >
                <FaLinkedin
                  size={ size }
                  className='linkedInIcon'
                />
                LinkedIn
              </a>
            </span>
          </div>
          <div>
            <span className='footerAddress'>
              <b>
                <FormattedMessage
                  id='Footer.address'
                  defaultMessage='Address'
                />
              </b>
              <p>
                { 
                  '495a Henry Street #1020,\n'+
                  'Brooklyn, NY, 11231,\n'+
                  'United States of America'
                }
              </p>
            </span>
            <span className='footerContact'>
              <b>
                <FormattedMessage
                  id='Footer.contact'
                  defaultMessage='Contact Us'
                />
              </b>
              <a
                href={ 'tel: +1(929)-359-3985' }
              >
                <FaPhone
                  size={ size }
                  label={ (
                    <FormattedMessage
                      id="UserForm.phoneNumber"
                      defaultMessage="Phone Number"
                    />
                  ) }
                />
                { '+1(929)-359-3985' }
              </a>
              <a
                href={ 'mailto:'+contactInfo.EMAIL }
              >
                <FaEnvelope
                  size={ size }
                  label={ (
                    <FormattedMessage
                      id="UserForm.email"
                      defaultMessage="Email address"
                    />
                  ) }
                />
                { ' '+contactInfo.EMAIL }
              </a>
            </span>
          </div>
        </span>
      </span>
    );
  }

}

Footer.propTypes = {
  currentUser: PropTypes.object.isRequired,
};

export default Footer;
