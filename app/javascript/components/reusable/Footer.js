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
import { Link } from 'react-router-dom';

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
            <Link to={ formatLink('/about', locale) }>
              <FormattedMessage
                id='aboutPage'
                defaultMessage='About'
              />
            </Link>
            <Link to={ formatLink('/FAQ', locale) }>
              FAQ
            </Link>
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
          <span className='footerAddress'>
            <b>Address</b>
            495A Henry St #1020
            <br />
            Brookyln, NY, 11231,
            <br />
            United States of America
          </span>
          <span className='footerContact'>
            <b>Contact</b>
            <a href={ 'tel:'+contactInfo.PHONE }>
              Tel: +1-202-555-0159
            </a>
            <a href={ 'mailto:'+contactInfo.EMAIL }>
              Email: admin@tutoria.io
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
