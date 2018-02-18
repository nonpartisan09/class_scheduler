import React, { Component } from 'react';

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

export default Logo;
