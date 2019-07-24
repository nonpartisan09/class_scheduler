import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';

import { FormattedMessage } from 'react-intl';
import RaisedButton from 'material-ui/RaisedButton';
import './utils/CheckMobile';
import Logo from './reusable/Logo';

import formatLink from './utils/Link';
import PageHeader from './reusable/PageHeader';

class NotFoundPage extends Component {
  render() {
    const { currentUser: { locale }, currentUser } = this.props;
    return (
      <div className='notFoundPageContainer'>
        <Paper zDepth={ 1 } className='paperOverride' rounded={ false }>
          <Logo />
          <PageHeader title={
            <FormattedMessage
              id='NotFoundPage.title'
              defaultMessage='Oops!'
            />
            }
          />

          <div className='notFoundPageSection'>
            <FormattedMessage
              id='NotFoundPage.notFoundPage'
              defaultMessage='The page doesn’t exist or some other error occurred.'
            />
          </div>
          <a href={ formatLink('/', locale) }>
            <RaisedButton
              primary
              label={
                <FormattedMessage
                  id='homeLink'
                />
              }
            />
          </a>
        </Paper>
      </div>
    );
  }

}

NotFoundPage.propTypes = {
  currentUser: PropTypes.object
};

NotFoundPage.defaultProps = {
 currentUser: {
   locale: ''
 }
};

export default NotFoundPage;
