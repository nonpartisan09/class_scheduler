import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';

import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import AccountCircleIcon from 'material-ui/svg-icons/action/account-circle';

import './SearchResults.css';

class SearchResults extends Component {
  render() {
    const { teachers } = this.props;
    if (_.size(teachers) > 0) {
      return (
        <List>
          <Subheader>Available Teachers</Subheader>
          { this.renderTeachers() }
        </List>
      );
    } else {
      return null;
    }
  }

  renderTeachers() {
    const { teachers } = this.props;

    return _.map(_.values(teachers), ({ thumbnail_image,  first_name, city, last_logged_in, courses, url_slug, available_days }, key) => {
      const handleClick = () => {
        location.assign(`/profiles/${url_slug}`);
      };

      return (
        <ListItem
          key={ key }
          value={ key }
          onClick={ handleClick }
          leftAvatar={ thumbnail_image ? <img className='searchResultsAvatar' src={ thumbnail_image } alt='Profile Picture' /> : null  }
          leftIcon={ thumbnail_image? null : <AccountCircleIcon /> }
          primaryText={
            <div className='resultsListContainer'>
              <div className='resultsFirstName'>
                { first_name }
              </div>
              <div className='resultsLastLogin'>
                { last_logged_in? `Last active: ${ last_logged_in } ago` : '' }
              </div>
              { this.renderCity(city) }

              { this.renderAvailableDays(available_days) }
              <div className='resultsCourses'>
                Can teach: { _.trimEnd(courses.join(', '), ', ')}
              </div>
            </div>
          }
        />
       );
    });
  }

  renderAvailableDays(days) {
    if (_.size(days) > 0) {
      return (
        <div className='resultsAvailableDays'>
          Available: { _.trimEnd(days.join(', '), ', ')}
        </div>
      );
    }
  }

  renderCity(city) {
    const { currentUserCity } = this.props;

    if (city && currentUserCity) {
     return (
       <div className='resultsCity'>
         { `Location: ${ city }` }
       </div>
     );
    }
  }
}

SearchResults.propTypes = {
  teachers: PropTypes.array,
  currentUserCity: PropTypes.string
};

SearchResults.defaultProps = {
  teachers: [],
  currentUserCity: ''
};

export default SearchResults;
