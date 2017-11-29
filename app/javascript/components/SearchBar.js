import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Joi from 'joi-browser';
import validate from 'react-joi-validation';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import moment from 'moment';

import { getData } from './sendData';
import Header from './Header';
import SearchResults from './SearchResults';
import SearchOptionalFields from './SearchOptionalFields';

import './SearchBar.css';

function restfulUrl({ day, course, start_time, end_time, distance }) {
  const startParam = _.isDate(start_time)? `&start_time=${moment(start_time).format('HH:MM')}` : '';
  const endParam = _.isDate(end_time)? `&end_time=${moment(end_time).format('HH:MM')}`: '';
  const dayParam = _.size(day) > 0? `&day=${day}` : '';
  const courseParam = _.size(course) > 0? `course=${course}` : '';
  const distanceParam = distance > 0? `&distance=${distance}` : '';

  return `/results?${courseParam}${dayParam}${startParam}${endParam}${distanceParam}`;
}

const schema = {
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
  distance: Joi.number(),

  start_time: Joi.date().timestamp().options({
    language: {
      any: {
        allowOnly: 'Please select a start time'
      }
    }
  }),
  end_time: Joi.date().timestamp().options({
    language: {
      any: {
        allowOnly: 'Please enter an end time'
      }
    }
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
      teachers: { },
      error: '',
      status
    };
  }

  render() {
    const {
      days,
      courses,
      errors,
      changeHandler,
      changeValue,
      validateHandler,
      search: {
        distance,
        course,
        day,
        start_time,
        end_time
      },
      currentUser: {
        city
      } ,
      validateAllHandler
    } = this.props;

    return (
      <div>
        <Header currentUser={ this.props.currentUser } />
        { this.renderTitle() }

        <div className='searchBarContainer'>

          <div className='searchBarOptionContainer'>
            <SelectField
              className='searchBarOption'
              hintText='Class(es)'
              value={ course }
              onChange={ this.changeHandlerCourse }
              multiple
              errorText={ errors.course }
              selectionRenderer={ this.selectionRendererCourse }
            >
              { _.map(courses, ({ name, id }) => {
                return <MenuItem key={ id } insetChildren checked={ _.indexOf(course, id) > -1 } value={ id } primaryText={ <span> { name } </span> } />;
              })}
            </SelectField>

            <SelectField
              hintText='Day(s)'
              value={ day }
              errorText={ errors.day }
              onChange={ this.changeHandlerDay }
              className='searchBarOption'
              multiple
              selectionRenderer={ this.selectionRendererDay }
            >
              { _.map(days, (value, key) => <MenuItem key={ value + key } insetChildren checked={ _.indexOf(day, value) > -1 } value={ value } primaryText={ <span> { value } </span> } />) }
            </SelectField>
          </div>

          <SearchOptionalFields
            onChange={ changeHandler }
            changeValue={ changeValue }
            onBlur={ validateHandler }
            startTime={ start_time }
            endTime={ end_time }
            distance={ distance }
            city={ city }
            errors={ errors }
          />

          <RaisedButton onClick={ validateAllHandler(this.handleSubmit) } className='searchBarOption searchBarButton' label='Search' primary />

          { this.renderResults() }
        </div>
      </div>
    );
  }

  renderTitle() {
    const { match: { params: { sign_up } } } = this.props;

    if (sign_up) {
      return (
        <h1 className='signUpHeader'>
          Join Tutoria community: Step 2/2
        </h1>
      );
    }
  }

  renderResults() {
    const { status } = this.state;

    if (status === 204) {
      return (
        <div className='emptyTeacherResults'>
          Sorry, it seems no teachers match these filters.
        </div>
      );
    } else {
      const { teachers } = this.state;
      const { currentUser: { city } } = this.props;

      return (
        <SearchResults
          { ...teachers }
          currentUserCity={ city }
        />
      );
    }
  }

  changeHandlerCourse(event, index, value) {
    const { changeValue } = this.props;
    changeValue('course', value, { validate: true });
  }

  changeHandlerDay(event, index, value) {
    const { changeValue } = this.props;
    changeValue('day', value, { validate: true });
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

    const requestParams = {
      url: restfulUrl(search),
      jsonBody: null,
      method: 'GET',
      successCallBack: (response, status) => {
        return this.setState({
          teachers: response,
          status
        });
      },
      errorCallBack: (message) => {
        this.setState({
          error: message
        });
      }
    };

    return getData(requestParams);
  }
}

SearchBar.propTypes = {
  match: PropTypes.object,
  courses: PropTypes.array,
  errors: PropTypes.object,
  days: PropTypes.array,
  currentUser: PropTypes.shape({
    first_name: PropTypes.string,
    email: PropTypes.string,
    city: PropTypes.string,
    start_time: PropTypes.object,
    end_time: PropTypes.object
  }),
  search: PropTypes.shape({
    day: PropTypes.array,
    course: PropTypes.array,
    distance: PropTypes.number,
    start_time: PropTypes.instanceOf(Date),
    end_time: PropTypes.instanceOf(Date),
  }),
  validateAllHandler: PropTypes.func.isRequired,
  validateHandler: PropTypes.func.isRequired,
  changeHandler: PropTypes.func.isRequired,
  changeValue: PropTypes.func.isRequired,
};

SearchBar.defaultProps = {
  match: {
    params: { }
  },
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
    distance: 0,
  }
};

const validationOptions = {
  joiSchema: schema,
  only: 'search',
  allowUnknown: true
};

export default validate(SearchBar, validationOptions);
