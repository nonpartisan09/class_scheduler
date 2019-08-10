import React, { Component } from 'react';
import PropTypes from 'prop-types';

import formatLink from '../utils/Link';
import Logo from './Logo';

class HomeLink extends Component {
  render() {
    return (
      <a href={ formatLink('/', this.props.locale) } className='homeLogoLink'>
        <Logo />
      </a>
    );
  }
}

HomeLink.propTypes = {
  locale: PropTypes.string,
};

HomeLink.defaultProps = {
  locale: ''
};

export default HomeLink;
