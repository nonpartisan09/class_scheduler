import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

class HomeLink extends Component {
  render() {
    return (
      <a href='/' className='slidingLink' >
        <FormattedMessage
          id='homeLink'
          defaultMessage='Home'
        />
      </a>
    );
  }

}

export default HomeLink;
