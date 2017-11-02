import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';

import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';

import DoubleSlider from './reusable/slider/DoubleSlider';

import './SearchResults.css';

class SearchResults extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleFirstSlider = this.handleFirstSlider.bind(this);
    this.handleSecondSlider = this.handleSecondSlider.bind(this);

    this.state = {
      firstSlider: 0,
      secondSlider: 385
    };
  }

  render() {
    const { teachers } = this.props;
    if (_.size(teachers) > 0) {
      return (
        <div>
          <div className='sliderContainer'>
            <DoubleSlider
              steps={ 0.15 }
              minValue={ 0 }
              maxValue={ 24 }
              width={ 400 }
              firstSlider={ this.state.firstSlider }
              secondSlider={ this.state.secondSlider }
              onClickFirstSlider={ this.handleFirstSlider }
              onClickSecondSlider={ this.handleSecondSlider }
            />
          </div>

          <List>
            <Subheader>Available Teachers</Subheader>
            { this.renderTeachers() }
          </List>
        </div>
      );
    } else {
      return null;
    }
  }

  renderTeachers() {
    const { teachers } = this.props;

    return _.map(teachers, ({ first_name, city, last_logged_in, courses, url_slug, available_days}, index) => {
      const handleClick = () => {
        location.assign(`/profiles/${url_slug}`);
      };

      return (
        <ListItem
          key={ index }
          value={ index }
          onClick={ handleClick }
          primaryText={
            <div className='resultsListContainer'>
              <div className='resultsFirstName'>
                { first_name }
              </div>
              <div className='resultsLastLogin'>
                { last_logged_in? `Last sign in: ${ last_logged_in } ago` : '' }
              </div>
              { this.renderCity(city) }

              { this.renderAvailableDays(available_days) }
              <div className='resultsCourses'>
                Teach: { _.trimEnd(courses.join(', '), ', ')}
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

  handleFirstSlider(value) {
    this.setState({
      firstSlider: value
    });
  }

  handleSecondSlider(value) {
    this.setState({
      secondSlider: value
    });
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
