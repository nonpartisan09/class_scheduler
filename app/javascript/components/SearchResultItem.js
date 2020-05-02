import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import MoodIcon from 'material-ui/svg-icons/social/mood';
import { Card, CardHeader } from 'material-ui/Card';

import ReviewAsStars from './ReviewAsStars';
import formatLink from './utils/Link';
import MessageButtons, { MessageTypes } from './reusable/MessageButtons';

class SearchResultItem extends Component {
  constructor(props) {
    super(props);

    this.handleViewProfileClick = this.handleViewProfileClick.bind(this);
  }

  render() {
    const { firstName, lastLoggedin, urlSlug, ratingCount, averageRating, locale } = this.props;

    return (
      <Card className='searchResultItemCard'>
        <CardHeader
          title={ firstName }
          subtitle={ (
            <div className='searchResultItemDetails'>
              <p>
                Last login: 
                {' '}
                {lastLoggedin}
              </p>
              <p className='searchResultItemTruncate'>
                { this.renderLanguages() }
              </p>
              <p className='searchResultItemTruncate'>
                { this.renderPrograms() }
              </p>
              <p className='searchResultItemTruncate'>
                { this.renderUserLocation() }
              </p>

              <ReviewAsStars
                ratingCount={ ratingCount }
                averageRating={ averageRating }
              />
            </div>
          ) }
          avatar={ this.renderAvatar() }
        />
        <MessageButtons
          newMessageFirstName={ firstName }
          newMessageRecipient={ urlSlug }
          locale={ locale }
          messageType={ MessageTypes.SEND }
          handleViewProfileClick={ this.handleViewProfileClick }
        />
      </Card>
    );
  }

  handleViewProfileClick() {
 
    const { urlSlug: url_slug, search, history, volunteers, locale } = this.props;

    history.push(formatLink(`/profiles/${url_slug}`, locale), { ...{ search }, volunteers });
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
    const { isCurrentUserLocated, city, state, country } = this.props;

    if (isCurrentUserLocated) {
      return _.compact([ city, state, country ]).join(', ');
    } else {
      return null;
    }
  }
}

SearchResultItem.propTypes = {
  isCurrentUserLocated: PropTypes.bool,
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
  ratingCount: PropTypes.number,
  search: PropTypes.object,
  volunteers: PropTypes.array,
  history: PropTypes.object,
  locale: PropTypes.string,
};

SearchResultItem.defaultProps = {
  locale: '',
  volunteers: [],
  search: {},
  averageRating: 0,
  isCurrentUserLocated: false,
  firstName: '',
  city: '',
  country: '',
  state: '',
  lastLoggedin: '',
  programs: [],
  urlSlug: '',
  languages: [],
  ratingCount: 0,
  history: {}
};

export default SearchResultItem;