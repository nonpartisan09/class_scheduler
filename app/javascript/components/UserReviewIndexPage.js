import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Paper from 'material-ui/Paper';
import { FormattedMessage } from 'react-intl';
import Header from './reusable/Header';
import Footer from './reusable/Footer';
import PageHeader from './reusable/PageHeader';

import './UserReviewIndexPage.css';

class UserReviewIndexPage extends Component {
  render() {
    const { currentUser } = this.props;

    return (
      <div>
        <Header currentUser={ currentUser } />
        <Paper zDepth={ 1 } className='paperOverride' rounded={ false }>
          <PageHeader title={
            <FormattedMessage
              id='UserReviewIndexPage.header'
              defaultMessage='Most recent reviews'
            />
          } />
          <ul className='userReviewIndexPageContainerList'>
            { this.renderContent() }
          </ul>
        </Paper>
        <Footer />
      </div>
    );
  }
  renderContent() {
    const { comments } = this.props;

    if (_.size(comments) > 0) {
      return _.map(comments, ({ comment, created_at, reviewer, reviewee }, index) => {
        return (
          <li key={ index } className='userReviewIndexPageContainerListItem'>
            <span>Posted { created_at } - </span>
            <span>about {reviewee} - </span>
            <span> { this.renderComment(comment) }</span>
          </li>
        );
      });
    } else {
      return (
        <li>
          <FormattedMessage
            id='UserReviewIndexPage.noReviewAvailable'
            defaultMessage='No reviews available'
          />
        </li>
      );
    }
  }

  renderComment(comment) {
    if (comment) {
      return comment;
    } else {
      return (
        <FormattedMessage
          id='UserReviewIndexPage.unavailable'
          defaultMessage='Not available'
        />
      );
    }
  }
}

UserReviewIndexPage.propTypes = {
  comments: PropTypes.array,
  reviewer: PropTypes.string,
  currentUser: PropTypes.object
};

UserReviewIndexPage.defaultProps = {
  comments: [],
  reviewer: '',
  currentUser: {}
};

export default UserReviewIndexPage;
