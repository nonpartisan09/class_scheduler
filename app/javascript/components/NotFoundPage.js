import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';

import { FormattedMessage } from 'react-intl';
import ErrorIcon from 'material-ui/svg-icons/alert/error';

import Header from './Header';
import './utils/CheckMobile';

import './NotFoundPage.css';
import Footer from './Footer';

class NotFoundPage extends Component {
  render() {
    return (
      <div className='notFoundPageContainer'>
        <Header currentUser={ this.props.currentUser } />
        <Paper zDepth={ 1 } className='paperOverride' rounded={ false }>
          <h1>
            <FormattedMessage
              id='NotFoundPage.title'
              defaultMessage='Oops!'
            />
          </h1>
          <ErrorIcon style={ { width: '150px', height: '150px' } } />
          <div className='notFoundPageSection'>
            <FormattedMessage
              id='NotFoundPage.notFoundPage'
              defaultMessage='Page doesn’t exist or some other error occurred.'
            />
          </div>
        </Paper>
        <Footer />
      </div>
    );
  }

}

NotFoundPage.propTypes = {
  currentUser: PropTypes.object
};

NotFoundPage.defaultProps = {
 currentUser: {}
};

export default NotFoundPage;
