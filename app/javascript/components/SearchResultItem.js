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

import './SearchResultItem.css';

class SearchResultItem extends Component {
  render() {
    const { firstName, city, lastLoggedin, urlSlug, ratingCount } = this.props;

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
                { this.renderCity(city) }
              </p>
              <div className='searchResultItemReview' >
                { this.renderReviews() }
              </div>
              <span>
                { `${ratingCount} rating(s)`}
              </span>
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

  renderReviews() {
    const { averageRating } = this.props;

    return [
      _.times(5, (index) => {
        const className = function(){
          if (index < averageRating) {
            return 'searchResultItemStar searchResultItemStarSelected';
          } else {
            return 'searchResultItemStar';
          }
        }();

        return (
          <div key={ index } className={ className }>
            <label htmlFor={ `starRating${index}` } />
            <option
              value={ index + 1 }
              id={ `starRating${index}` }
            />
          </div>
        );
      })
    ];
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

  renderCity(city) {
    const { currentUserCity } = this.props;

    if (city && currentUserCity) {
      return city;
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
  lastLoggedin: '',
  programs: [],
  urlSlug: '',
  languages: [],
  ratingCount: 0
};

export default SearchResultItem;
