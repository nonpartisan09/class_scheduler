import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './Logo.css';

class Logo extends Component {

  render() {
    return (
      <h1 className='logoItem'>
        <img
          className='logo'
          alt='tutoria logo'
          src='/assets/tutoria_logo_full color_web.png'
        />
      </h1>
    );
  }

}

Logo.propTypes = {

};

Logo.defaultProps = {

};

export default Logo;
