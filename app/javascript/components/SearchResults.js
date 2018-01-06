import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import AccountCircleIcon from 'material-ui/svg-icons/action/account-circle';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import EditIcon from 'material-ui/svg-icons/image/edit';

import './SearchResults.css';

class SearchResults extends Component {
  render() {
    const { volunteers } = this.props;
    if (_.size(volunteers) > 0) {
      return (
        <List>
          <Subheader>Available Volunteers</Subheader>
          { this.renderVolunteers() }
        </List>
      );
    } else {
      return null;
    }
  }

  renderVolunteers() {
    const { volunteers } = this.props;

    return _.map(_.values(volunteers), ({ thumbnail_image,  first_name, city, last_logged_in, programs, url_slug, available_days }, key) => {

      const handleClick = () => {
        location.assign(`/profiles/${url_slug}`);
      };

      return [
        <ListItem
          key={ key }
          value={ key }
          leftAvatar={ thumbnail_image ? <img className='searchResultsAvatar' src={ thumbnail_image } alt='Profile Picture' /> : null  }
          leftIcon={ thumbnail_image? null : <AccountCircleIcon /> }
          primaryText={
            <div >
              <div className='resultsListContainer' onClick={ handleClick }>
                <div className='resultsFirstName'>
                  { first_name }
                </div>
                <div className='resultsLastLogin'>
                  { last_logged_in? `Last active: ${ last_logged_in } ago` : '' }
                </div>
                { this.renderCity(city) }

                { this.renderAvailableDays(available_days) }
                <div className='resultsPrograms'>
                  Programs offered: { _.trimEnd(programs.join(', '), ', ')}
                </div>
              </div>
              <Link key={ key + 'link' } onClick={ this.handleClick } className='userProfileSendEmail' to={ { pathname: '/messages/new', query: { recipient: url_slug, userName: first_name } } } >
                <FloatingActionButton>
                  <EditIcon />
                </FloatingActionButton>
              </Link>
            </div>
          }
        />,

       ];
    });
  }

  handleClick() {
    return (event) => {
      event.stopPropagation();
    };
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
  volunteers: PropTypes.array,
  currentUserCity: PropTypes.string
};

SearchResults.defaultProps = {
  volunteers: [],
  currentUserCity: ''
};

export default SearchResults;
