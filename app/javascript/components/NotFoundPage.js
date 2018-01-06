import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

class NotFoundPage extends Component {

  render() {
    return (
      <div>
        <FormattedMessage
          id='NotFoundPage.title'
          defaultMessage='Oops!'
        />
        <FormattedMessage
          id='NotFoundPage.notFoundPage'
          defaultMessage='The page doesn’t exist or some other error occurred'
        />
        <FormattedMessage
          id='NotFoundPage.linkToHome'
          defaultMessage='Go to our'
        />
      </div>
    );
  }

}

NotFoundPage.propTypes = {

};

NotFoundPage.defaultProps = {

};

export default NotFoundPage;
