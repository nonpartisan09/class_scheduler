import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import MoodIcon from 'material-ui/svg-icons/social/mood';
import EmailIcon from 'material-ui/svg-icons/communication/email';

import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { Card, CardActions, CardHeader } from 'material-ui/Card';

import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

import ReviewAsStars from './ReviewAsStars';
import './SearchResultItem.css';

class SearchResultItem extends Component {
  render() {
    const { firstName, lastLoggedin, urlSlug, ratingCount, averageRating } = this.props;

    return (
      <Card className='searchResultItemCard' >
        <CardHeader
          title={ firstName }
          subtitle={
            <div className='searchResultItemDetails' >
              <p>
                Last login: {lastLoggedin} ago
              </p>
              <p>
                { this.renderLanguages() }
              </p>
              <p>
                { this.renderPrograms() }
              </p>
              <p>
                { this.renderUserLocation() }
              </p>

              <ReviewAsStars
                ratingCount={ ratingCount }
                averageRating={ averageRating }
              />
            </div>
          }
          avatar={ this.renderAvatar() }
        />
        <CardActions>
          <Link to={ { pathname: '/messages/new', query: { recipient: urlSlug, userName: firstName } } } >
            <RaisedButton
              className='searchResultItemRequest'
              label={
                <span>
                  <div className='searchResultItemRequestIcon'>
                    <EmailIcon color='white' />
                  </div>
                  <FormattedMessage
                    id='SearchResultItem.request'
                    defaultMessage='Request'
                  />
                </span>
              }
              primary
            />
          </Link>

          <a href={ `/profiles/${urlSlug}` }>
            <FlatButton
              className='searchResultItemVisitProfile'
              label={
                <FormattedMessage
                  id='SearchResultItem.viewProfile'
                  defaultMessage='View Profile'
                />
              }
              primary
            />
          </a>
        </CardActions>
      </Card>
    );
  }

  renderAvatar() {
    const { avatar } = this.props;

    if (_.isEmpty(avatar) || _.endsWith(avatar, 'missing.png')) {
      return(
        <div className='searchResultItemAvatar'>
          <MoodIcon style={ { width: '80%', height: '80%' } } />
        </div>
      );
    } else {
      return <img className='searchResultItemAvatar' src={ avatar } alt='Profile' />;
    }
  }

  renderLanguages() {
    if (_.size(this.props.languages) > 0) {
      return _.trimEnd(this.props.languages.join(', '), ', ');
    }
  }

  renderPrograms() {
    if (_.size(this.props.programs) > 0) {
      return _.trimEnd(this.props.programs.join(', '), ', ');
    }
  }

  renderUserLocation() {
    const { currentUserCity, city, state, country } = this.props;

    if (currentUserCity) {
      return _.compact([ city, state, country ]).join(', ');
    } else {
      return null;
    }
  }
}

SearchResultItem.propTypes = {
  currentUserCity: PropTypes.string,
  avatar: PropTypes.node.isRequired,
  firstName: PropTypes.string,
  city: PropTypes.string,
  country: PropTypes.string,
  state: PropTypes.string,
  lastLoggedin: PropTypes.string,
  programs: PropTypes.array,
  urlSlug: PropTypes.string,
  languages: PropTypes.array,
  averageRating: PropTypes.number,
  ratingCount: PropTypes.number
};

SearchResultItem.defaultProps = {
  averageRating: 0,
  currentUserCity: '',
  firstName: '',
  city: '',
  country: '',
  state: '',
  lastLoggedin: '',
  programs: [],
  urlSlug: '',
  languages: [],
  ratingCount: 0
};

export default SearchResultItem;
