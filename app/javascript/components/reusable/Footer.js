import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Toolbar,
  AppBar
} from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { 
  FaFacebookF,
  FaRegCopyright
} from 'react-icons/fa';

import formatLink from '../utils/Link';
import PaypalButton from '../PaypalButton';

class Footer extends Component {
  render() {
    return (
      <AppBar 
        position='static'
        style={ { backgroundColor: 'white' } }
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
    const facebook = 'Facebook';
    const facebookLink = 'https://www.facebook.com/Tutoria-416182735512904/';
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
            2019 Tutoria, Inc.
          </span>
          <span className='footerLinks'>
            <a href={ formatLink('/about', locale) }>
              <FormattedMessage
                id='aboutPage'
                defaultMessage='About'
              />
            </a>
            <a href={ formatLink('/FAQ', locale) }>
              FAQ
            </a>
            <a href={ facebookLink }>
              <FaFacebookF
                size={ size }
                className='facebookIcon'
              />
              { facebook }
            </a>
          </span>
          <span className='footerAddress'>
            <b>Address</b>
            495A Henry St #1020
            Brookyln, NY, 11231,
            United States of America
          </span>
        </span>
      </span>
    );
  }

}

Footer.propTypes = {
  currentUser: PropTypes.object,
};

Footer.defaultProps = {
  currentUser: { }
};

export default Footer;
