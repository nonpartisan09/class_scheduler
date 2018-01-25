import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';

import { FormattedMessage } from 'react-intl';
import RaisedButton from 'material-ui/RaisedButton';
import Header from './reusable/Header';
import Footer from './reusable/Footer';
import './utils/CheckMobile';
import Logo from './reusable/Logo';

import './NotFoundPage.css';
import HomeLink from './reusable/HomeLink';

class NotFoundPage extends Component {
  render() {
    return (
      <div className='notFoundPageContainer'>
        <Header currentUser={ this.props.currentUser } />
        <Paper zDepth={ 1 } className='paperOverride' rounded={ false }>
          <Logo />
          <h1>
            <FormattedMessage
              id='NotFoundPage.title'
              defaultMessage='Oops!'
            />
          </h1>
          <div className='notFoundPageSection'>
            <FormattedMessage
              id='NotFoundPage.notFoundPage'
              defaultMessage='The page doesn’t exist or some other error occurred.'
            />
          </div>
          <a href='/'>
            <RaisedButton
              primary
              label={
                <FormattedMessage
                  id='homeLink'
                  defaultMessage='Home'
                />
              }
            />
          </a>
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
