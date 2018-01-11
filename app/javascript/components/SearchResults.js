import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';

import Subheader from 'material-ui/Subheader';
import SearchResultItem from './SearchResultItem';
import Header from './Header';

import './SearchResults.css';

class SearchResults extends Component {
  componentWillMount() {
    const { location: { state } } = this.props;

    if (!state) {
      location.assign('/search');
    }
  }

  render() {
    const { currentUser } = this.props;

    return (
      <div>
        <Header currentUser={ currentUser } />
        <div className='searchResultsContainer'>
          <Subheader>Available Volunteers</Subheader>

          <div className='searchResults'>
            { this.renderVolunteers() }
          </div>
        </div>
      </div>
    );
  }

  renderVolunteers() {
    const { location: { state }, currentUser: { city: currentUserCity }  } = this.props;

    if (state && state.volunteers) {
      return _.map(_.values(state.volunteers), ({ languages, average_rating, thumbnail_image,  first_name, city, last_logged_in, programs, url_slug, available_days }, key) => {
        return [
          <SearchResultItem
            key={ key }
            currentUserCity={ currentUserCity }
            firstName={ first_name }
            avatar={ thumbnail_image }
            lastLoggedin={ last_logged_in }
            city={ city }
            programs={ programs }
            urlSlug={ url_slug }
            languages={ languages }
            averageRating={ average_rating }
          />
        ];
      });
    }
  }
}

SearchResults.propTypes = {
  currentUser: PropTypes.object,
  location: PropTypes.shape({
    state: PropTypes.shape({
      volunteers: PropTypes.array
    })
  }),
};

SearchResults.defaultProps = {
  currentUser: {},
  location: {
    state: {}
  }
};

export default SearchResults;
