import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import formatLink from '../utils/Link';
import Logo from './Logo';

class HomeLink extends Component {
  render() {
    return (
      <Link to={ formatLink('/', this.props.locale) } className='homeLogoLink'>
        <Logo />
      </Link>
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
