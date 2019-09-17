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
  FaLinkedin
} from 'react-icons/fa';

import formatLink from '../utils/Link';
import PaypalButton from '../PaypalButton';
import contactInfo from '../../ContactInfo';

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
        </h3>
        <span className='footerBody'>
          <span className='footerCopyright'>
            <span className='copyrightAndLogo'>
              Copyright
              { <FaRegCopyright className='copyrightLogo' /> }
            </span>
            2019 Tutoria,
            <br />
            Inc.
          </span>
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
            <a href={ formatLink('/FAQ', locale) }>
              FAQ
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
            <a href={ contactInfo.FACEBOOK } rel='noopener noreferrer' target='_blank'>
              <FaFacebookF
                size={ size }
                className='facebookIcon'
              />
              Facebook
            </a>
            <a href={ contactInfo.LINKEDIN } rel='noopener noreferrer' target='_blank'>
              <FaLinkedin
                size={ size }
                className='linkedInIcon'
              />
              LinkedIn
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
