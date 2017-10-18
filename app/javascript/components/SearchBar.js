import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TimePicker from 'material-ui/TimePicker';
import RaisedButton from 'material-ui/RaisedButton';
import moment from 'moment';

import Header from './Header';
import ErrorField from './reusable/ErrorField';

import './SearchBar.css';

function restfulUrl({ day, course, start_time, end_time }) {
  const start = start_time? moment(start_time).format('HH:MM') : '';
  const end = end_time? moment(end_time).format('HH:MM'): '';

  return `/results?course=${course}&day=${day}&start_time=${start}&end_time=${end}`;
}

class SearchBar extends Component {
  constructor(props) {
    super(props);

    this.handleDayChange = this.handleDayChange.bind(this);
    this.handleClassChange = this.handleClassChange.bind(this);
    this.handleChangeStartTime = this.handleChangeStartTime.bind(this);
    this.handleChangeEndTime = this.handleChangeEndTime.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      error: '',
      day: '',
      course: '',
      teachers: { },
      start_time: { },
      end_time: { },
      showResults: false,
    };
  }

  render() {
    const { days } = this.props;

    return (
      <div className='searchBarContainer'>
        <Header currentUser={ this.props.currentUser } />

        <ErrorField error={ this.state.error } />

        <div className='searchBarOptionContainer'>
          <SelectField
            className='searchBarOption'
            hintText='Select Class'
            value={ this.state.course }
            onChange={ this.handleClassChange }
            autoWidth
          >
            { this.renderClasses() }
          </SelectField>

          <SelectField
            className='searchBarOption'
            hintText='Select Day (optional)'
            value={ this.state.day }
            onChange={ this.handleDayChange }
            autoWidth
            multiple
          >
            { _.map(days, (item, index) => <MenuItem key={ index } value={ item } primaryText={ item } />)}
          </SelectField>

          <TimePicker
            className='searchBarOption'
            format='24hr'
            hintText='Start Time - 24Hr Format'
            value={ this.state.start_time }
            onChange={ this.handleChangeStartTime }
          />

          <TimePicker
            className='searchBarOption'
            format='24hr'
            hintText='End Time - 24Hr Format'
            value={ this.state.end_time }
            onChange={ this.handleChangeEndTime }
          />

          <RaisedButton onClick={ this.handleSubmit } className='searchSubmitButton' label='Search' primary />
        </div>

        <div className='teacherContainer'>
          { this.renderTeachers() }
        </div>
      </div>
    );
  }

  renderTeachers() {
    const { showResults } = this.state;

    if (showResults) {
      const { teachers } = this.state;
      if (_.size(teachers) > 0) {
        return (
          <div>
            Available teachers:
            {
              _.map(teachers, (teacher, index) => <div className='teacher' key={ index }>{ teacher.first_name }</div>)
            }
          </div>
        );
      } else {
        return <ErrorField error='Oops. It seems like no teacher is available. Why not try a different search?' />;
      }
    }
  }

  handleSubmit() {
    if (this.state.course) {
      this.postSearch();

      this.setState({
        showResults: true
      });
    } else {
      this.setState({
        error: 'Please select a class.'
      });
    }
  }

  postSearch() {
    return fetch(restfulUrl(this.state), {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        credentials: 'include'
      }
    }).then(response => {
      if (response.status < 400) {

        return response.json().then(({ teachers })=> {
          return this.setState({
            teachers
          });
        });
      }
    })
  }

  renderTimes() {
    //TODO render start and end time input fields
    //Add morning/afternoon options
    return null;
  }

  renderClasses() {
    const { courses } = this.props;

    if (_.size(courses)) {
      return courses.map((item) => {
        return (
          <MenuItem key={ item.id } value={ item.id } primaryText={ item.name } />
        );
      })
    }
  }

  handleChangeStartTime(event, date) {
    this.setState({
      start_time: date
    });
  }

  handleChangeEndTime(event, date) {
    this.setState({
      end_time: date
    });
  }

  handleClassChange(event, index, value) {
    this.setState({
      course: value
    });
  }

  handleDayChange(event, index, value) {
    this.setState({
      day: value
    });
  }
}

SearchBar.propTypes = {
  courses: PropTypes.array,
  days: PropTypes.array,
  currentUser: PropTypes.shape({
    first_name: PropTypes.string,
    email: PropTypes.string,
  })
};

SearchBar.defaultProps = {
  days: [],
  courses: [],
  currentUser: {
    first_name: '',
    email: '',
  }
};

export default SearchBar;
