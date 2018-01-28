import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';
import formatLink from '../utils/Link';

class HomeLink extends Component {
  render() {
    return (
      <a href={ formatLink('/', this.props.locale) } className='slidingLink' >
        <FormattedMessage
          id='homeLink'
          defaultMessage='Home'
        />
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
