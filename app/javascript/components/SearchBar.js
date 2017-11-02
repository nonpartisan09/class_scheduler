import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Joi from 'joi-browser';
import validate from 'react-joi-validation';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import moment from 'moment';

import Header from './Header';
import SearchResults from './SearchResults';

import './SearchBar.css';

function restfulUrl({ day, course, start_time, end_time }) {
  const startParam = _.isDate(start_time)? `&start_time=${moment(start_time).format('HH:MM')}` : '';
  const endParam = _.isDate(end_time)? `&end_time=${moment(end_time).format('HH:MM')}`: '';
  const dayParam = _.size(day) > 0? `&day=${day}` : '';
  const courseParam = _.size(course) > 0? `course=${course}` : '';

  return `/results?${courseParam}${dayParam}${startParam}${endParam}`;
}

const schema = {
  search: Joi.object().keys({
    day: Joi.array().min(1).required().options({
      language: {
        array: {
          min: 'Please select at least one day'
        }
      }
    }),
    course: Joi.array().min(1).required().options({
      language: {
        array: {
          min: 'Please select at least one course'
        }
      }
    }),
    distance: Joi.number()
  })
};

class SearchBar extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.selectionRendererCourse = this.selectionRendererCourse.bind(this);
    this.selectionRendererDay = this.selectionRendererDay.bind(this);
    this.changeHandlerCourse = this.changeHandlerCourse.bind(this);
    this.changeHandlerDay = this.changeHandlerDay.bind(this);

    this.state = {
      teachers: [],
    };
  }

  render() {
    const {
      days,
      courses,
      validateHandler,
      errors,
      search: {
        course,
        day,
      },
      currentUser: {
        city
      }
    } = this.props;

    return (
      <div className='searchBarContainer'>
        <Header currentUser={ this.props.currentUser } />

        <div className='searchBarOptionContainer'>
          <SelectField
            className='searchBarOption'
            hintText='Select One or More Class'
            value={ course }
            onChange={ this.changeHandlerCourse }
            onBlur={ validateHandler('course') }
            multiple
            errorText={ errors.course }
            selectionRenderer={ this.selectionRendererCourse }
          >
            { _.map(courses, ({ name, id }) => {
              return <MenuItem key={ id } insetChildren checked={ _.indexOf(course, id) > -1 } value={ id } primaryText={ <span> { name } </span> } />;
            })}
          </SelectField>

          <SelectField
            hintText='Select Day'
            value={ day }
            errorText={ errors.day }
            onChange={ this.changeHandlerDay }
            onBlur={ validateHandler('day') }
            className='searchBarOption'
            multiple
            selectionRenderer={ this.selectionRendererDay }
          >
            { _.map(days, (value, key) => <MenuItem key={ value + key } insetChildren checked={ _.indexOf(day, value) > -1 } value={ value } primaryText={ <span> { value } </span> } />) }
          </SelectField>

          { this.renderLocationSelect() }

          <RaisedButton onClick={ this.handleSubmit } className='searchSubmitButton' label='Search' primary />
        </div>

        <SearchResults teachers={ this.state.teachers } currentUserCity={ city } />
      </div>
    );
  }

  renderLocationSelect() {
    const { currentUser: { city } } = this.props;

    if (city) {
      const {
        changeHandler,
        validateHandler,
        errors,
        search: {
          distance
        }
      } = this.props;

      return (
        <SelectField
          hintText='Near me'
          value={ distance }
          errorText={ errors.distance }
          onChange={ changeHandler('distance') }
          onBlur={ validateHandler('distance') }
          className='searchBarOption'
        >
          <MenuItem insetChildren checked={ distance === 5 } key={ 0 } value={ 5 } primaryText='5 units' />
          <MenuItem insetChildren checked={ distance === 10 } key={ 1 } value={ 10 } primaryText='10 units' />
          <MenuItem insetChildren checked={ distance === 15 } key={ 2 } value={ 15 } primaryText='15 units' />
        </SelectField>
      );
    }
  }

  changeHandlerCourse(event, index, value) {
    const { changeValue } = this.props;
    changeValue('course', value);
  }

  changeHandlerDay(event, index, value) {
    const { changeValue } = this.props;
    changeValue('day', value);
  }

  selectionRendererDay(values) {
    if (_.size(values) > 1) {
      return _.trimEnd(values.join(', '), ', ');
    } else if (_.size(values) === 1) {
      return values.toString();
    }
  }

  selectionRendererCourse(values) {
    const { courses } = this.props;
    if (_.size(values) > 1) {
      const newValues = _.map(courses, ({ name, id }) => {
        if ( _.indexOf(values, id) > -1) {
          return `${name}, `;
        }
      });

      return _.trimEnd(newValues.join(''), ', ');

    } else if (_.size(values) === 1) {
      return _.map(courses, ({ name, id }) => { if (_.indexOf(values, id) > -1) { return name; } });
    }
  }

  handleSubmit() {
    const { errors } = this.props;
    if (_.size(errors) === 0) {
      this.postSearch();
    }
  }

  postSearch() {
    const { search } = this.props;
    return fetch(restfulUrl(search), {
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
    });
  }
}

SearchBar.propTypes = {
  courses: PropTypes.array,
  errors: PropTypes.object,
  days: PropTypes.array,
  currentUser: PropTypes.shape({
    first_name: PropTypes.string,
    email: PropTypes.string,
    city: PropTypes.string
  }),
  search: PropTypes.shape({
    day: PropTypes.array,
    course: PropTypes.array,
    distance: PropTypes.number
  }),
  validateHandler: PropTypes.func.isRequired,
  changeValue: PropTypes.func.isRequired,
  changeHandler: PropTypes.func.isRequired,
};

SearchBar.defaultProps = {
  days: [],
  errors: {},
  courses: [],
  currentUser: {
    first_name: '',
    email: '',
    city: ''
  },
  search: {
    day: [],
    course: [],
    distance: 0
  }
};

const validationOptions = {
  joiSchema: schema,
  only: 'search',
  allowUnknown: true
};

export default validate(SearchBar, validationOptions);
