import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Joi from 'joi-browser';
import validate from 'react-joi-validation';

import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TimePicker from 'material-ui/TimePicker';
import FormData from './FormData';

import Header from './Header';
import ErrorField from './reusable/ErrorField';
import { postData } from './sendData';

import './NewAvailability.css';

const nowDate = new Date();
const DEFAULT_START = _.toString(new Date(nowDate.setHours(0, 0)));
const DEFAULT_END = _.toString(new Date(nowDate.setHours(23, 59)));

const schema = Joi.object({ timezone: Joi.string().required().options({
                language: {
                  any: {
                    empty: 'Please select a timezone',
                  }
                }
              })
}).pattern(/[0-9]+/, Joi.object({
    day: Joi.string().required().options({
      language: {
        any: {
          required: 'Please select a day',
          empty: 'Please select a day',
        }
      }
    }),
    start_time: Joi.date().default(DEFAULT_START).options({
      language: {
        date: {
          timestamp: {
            javascript: 'Please select a start time'
          }
        }
      }
    }),
    end_time: Joi.date().default(DEFAULT_END).options({
      language: {
        date: {
          timestamp: {
            javascript: 'Please select an end time'
          }
        }
      }
    })
}));

function validateTimes({ values, validateAllValues, changingValues, errors }, callback){

  if (validateAllValues || _.some(changingValues, (item) => _.endsWith(item, 'start_time')) || _.some(changingValues, (item) =>_.endsWith(item, 'end_time'))) {
    _.each(changingValues, (item) => {
      const index = _.split(item, '.')[0];

      if (_.endsWith(item, 'start_time') || _.endsWith(item, 'end_time')) {
        if (values[index]) {
          if (values[index].start_time && values[index].end_time) {
            const endTimeIsBeforeStartTime = values[index].end_time < values[index].start_time;
            if (endTimeIsBeforeStartTime) {
              if (_.endsWith(item, 'start_time')) { _.set(errors, `${index}.start_time`, 'Please select a start time chronologically before end time'); };
              if (_.endsWith(item, 'end_time')) { _.set(errors, `${index}.end_time`, 'Please select an end time chronologically after end time'); };
            }
          }

          if (values[index].start_time && !values[index].end_time) {
            return values[index].end_time = new Date(nowDate.setHours(23, 59));
          } else if (values[index].end_time && !values[index].start_time) {
            return values[index].start_time = new Date(nowDate.setHours(0, 0));
          }
        }
      }
    });
  }

  callback({ values, errors });
}

class NewAvailability extends Component {
  constructor (props, context) {
    super(props, context);

    this.changeTimezoneHandler = this.changeTimezoneHandler.bind(this);
    this.changeDayHandler = this.changeDayHandler.bind(this);
    this.handleAddAvailability = this.handleAddAvailability.bind(this);
    this.handleRemoveAvailability = this.handleRemoveAvailability.bind(this);
    this.changeTimezoneHandler = this.changeTimezoneHandler.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      numberOfAvailabilities: 1,
      error: ''
    };
  }

  render() {
    const {
      validateAllHandler,
      availabilities: {
        timezone
      },
      validateHandler,
      timezones,
      errors,
      availabilities
    } = this.props;

    return (
      <div>
        <Header currentUser={ this.props.currentUser } />

        <div className='availabilityContainer'>
          { this.renderTitle() }
          <ErrorField error={ this.state.error } />

          <form className='newAvailabilityFormContainer'>
            <RaisedButton
              className='addAvailabilitiesButton'
              label='Create All Availabilities'
              primary
              onClick={ validateAllHandler(this.handleSubmit) }
            />

            <SelectField
              hintText='Select Timezone'
              value={ timezone }
              errorText={ errors.timezone }
              onChange={ this.changeTimezoneHandler }
              onBlur={ validateHandler('timezone') }
              fullWidth
            >
              { _.map(timezones, ({ name, id }, index) => <MenuItem key={ name + id + index } insetChildren checked={ availabilities && availabilities.timezone === name } value={ name } primaryText={ <span> { name } </span> } />) }
            </SelectField>

            { this.renderAvailabilities() }
          </form>
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

  handleSubmit() {
    const { errors, validateAllHandler } = this.props;

    validateAllHandler();

    if (_.size(errors) === 0) {
      const { availabilities } = this.props;

      const attributes = FormData.from({ availabilities });
      const requestParams = {
        url: '/availabilities',
        attributes,
        method: 'POST',
        successCallBack: () => {
          location.assign('/availabilities');
        },
        errorCallBack: (message) => {
          this.setState({
            error: message
          });
        }
      };

      return postData(requestParams);
    }
  }

  renderAvailabilities() {
    const { numberOfAvailabilities } = this.state;
    const { errors, changeHandler, validateHandler, validateAllHandler, days } = this.props;

    return _.times(numberOfAvailabilities, (index) => {
      const availability = index;
      const { availabilities } = this.props;

      return (
        <div key={ index } className='availabilitiesContainer' >
          <SelectField
            hintText='Select Day'
            value={ availabilities[index]? availabilities[index].day: {} }
            errorText={ _.get(errors, `${availability}.day`) }
            onChange={ this.changeDayHandler(availability) }
            onBlur={ validateHandler(`${availability}.day`) }
            fullWidth
          >
            { _.map(days, (value, key) => <MenuItem key={ value + key } insetChildren checked={ availabilities[index] && availabilities[index].day === value } value={ value } primaryText={ <span> { value } </span> } />) }
          </SelectField>

          <TimePicker
            format="24hr"
            hintText="Start Time - 24Hr Format"
            value={ availabilities[index]? availabilities[index].start_time: {} }
            errorText={ _.get(errors, `${availability}.start_time`) }
            onChange={ changeHandler(`${availability}.start_time`) }
            onDismiss={ validateAllHandler }
            autoOk
            fullWidth
          />

          <TimePicker
            format="24hr"
            hintText="End Time - 24Hr Format"
            value={ availabilities[index]? availabilities[index].end_time: {} }
            errorText={ _.get(errors, `${availability}.end_time`) }
            onChange={ changeHandler(`${availability}.end_time`) }
            onDismiss={ validateAllHandler }
            autoOk
            fullWidth
          />
          <FlatButton primary label='Add other availability' onClick={ this.handleAddAvailability } />
          { index === 0 ? null : <FlatButton primary label='Remove availability' onClick={ this.handleRemoveAvailability } /> }
        </div>
      );
    });
  }

  handleAddAvailability() {
    const { errors } = this.props;

    if (_.size(errors) === 0) {
      const { numberOfAvailabilities } = this.state;

      this.setState({
        numberOfAvailabilities: numberOfAvailabilities+1
      });
    }
  }

  handleRemoveAvailability() {
    const { numberOfAvailabilities } = this.state;

    this.setState({
      numberOfAvailabilities: numberOfAvailabilities-1
    });
  }

  changeTimezoneHandler(proxy, index, value) {
    const { changeValue } = this.props;

    changeValue('timezone', value);
  }

  changeDayHandler(path) {

    return (proxy, index, value) => {
      const { changeValue } = this.props;

      changeValue(`${path}.day`, value);
    };
  }
}


NewAvailability.propTypes = {
  match: PropTypes.object,
  errors: PropTypes.object,
  timezones: PropTypes.array,
  currentUser: PropTypes.shape({
    email: PropTypes.string,
  }),

  availabilities: PropTypes.shape({
    timezone: '',
    0: PropTypes.shape({
      start_time: PropTypes.object,
      end_time: PropTypes.object,
      day: PropTypes.string,
    })
  }),
  days: PropTypes.array,
  changeHandler: PropTypes.func.isRequired,
  changeValue: PropTypes.func.isRequired,
  validateAllHandler: PropTypes.func.isRequired,
  validateHandler: PropTypes.func.isRequired,
};

NewAvailability.defaultProps = {
  match: {
    params: {

    }
  },
  currentUser: {
    email: '',
  },
  errors: {},
  days: [],
  timezones: [],
  availabilities: {
    timezone: 'UTC',
    0: {
      start_time: {},
      end_time: {},
      day: '',
    }
  },
};

NewAvailability.contextTypes = {
  router: PropTypes.object
};

const validationOptions = {
  joiSchema: schema,
  only: 'availabilities',
  allowUnknown: true,
  validator: validateTimes
};

export default validate(NewAvailability, validationOptions);

