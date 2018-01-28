import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Paper from 'material-ui/Paper';
import { FormattedMessage } from 'react-intl';
import Header from './reusable/Header';
import Footer from './reusable/Footer';

import formatLink from './utils/Link';

class UserReviewIndexPage extends Component {
  render() {
    const { comments, currentUser: { locale } } = this.props;

    if (_.size(comments) > 0) {
      return _.map(comments, ({ comment, created_at, reviewer, reviewer_url_slug }, index) => {
        return (
          <li key={ index } className='commentContainerListItem'>
            <span>Posted { created_at } - </span>
            <span>by
              <a href={ formatLink(`/reviews/${reviewer_url_slug}`, locale) } className='slidingLink'>
                { reviewer }
              </a>-
            </span>
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
    if(comment) {
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

  renderTest() {
    return (
      <div>
        <Header currentUser={ currentUser } />
        <Paper zDepth={ 1 } className='paperOverride' rounded={ false }>
          { this.renderContent() }
          </Paper>
        <Footer />
      </div>
    );
  }
}

UserReviewIndexPage.propTypes = {
  comments: PropTypes.object,
  currentUser: PropTypes.object
};

UserReviewIndexPage.defaultProps = {
  comments: {},
  currentUser: {}
};

export default UserReviewIndexPage;
