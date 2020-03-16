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
import { gtag_click_conversion, opts } from './tracking'

class Footer extends Component {

  render() {
    const { style } = this.props;
    return (
      <AppBar
        position='relative'
        classes={ { root: 'footerAppBar' } }
        style={ style }
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
            <a href={ contactInfo.FACEBOOK } onClick={
            () => gtag_click_conversion(contactInfo.FACEBOOK, locale === 'en' ? opts.facebook_en : opts.facebook_es)
            }
            rel='noopener noreferrer' target='_blank'>
              <FaFacebookF
                size={ size }
                className='facebookIcon'
              />
              Facebook
            </a>
            <a href={ contactInfo.LINKEDIN }  onClick={
            () => gtag_click_conversion(contactInfo.LINKEDIN, locale === 'en' ? opts.linkedin_en : opts.linkedin_es)
            } rel='noopener noreferrer' target='_blank'>
              <FaLinkedin
                size={ size }
                className='linkedInIcon'
              />
              LinkedIn
            </a>
          </span>
          <span className='footerAddress'>
            <b>
              <FormattedMessage
                id='Footer.address'
                defaultMessage='Address'
              />
            </b>
            { 
              '495a Henry Street #1020,\n'+
              'Brooklyn, NY, 11231,\n'+
              'United States of America'
            }
          </span>
          <span className='footerContact'>
            <b>
              <FormattedMessage
                id='Footer.contact'
                defaultMessage='Contact Us'
              />
            </b>
            <a
              href={ 'tel:'+contactInfo.PHONE }
              onClick={
              () => gtag_click_conversion(contactInfo.PHONE, locale === 'en' ? opts.phone_en : opts.phone_es)
              }
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
              { ' '+contactInfo.PHONE }
            </a>
            <a
              href={ 'mailto:'+contactInfo.EMAIL }
              onClick={
              () => gtag_click_conversion(contactInfo.EMAIL, locale === 'en' ? opts.email_en : opts.email_es)
              }
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
        </span>
      </span>
    );
  }

}

Footer.propTypes = {
  currentUser: PropTypes.object.isRequired,
  style: PropTypes.object.isRequired,
};

export default Footer;
