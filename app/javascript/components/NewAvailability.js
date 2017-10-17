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

import Header from './Header';
import ErrorField from './reusable/ErrorField';

import './NewAvailability.css';

const schema = {
  availabilities: Joi.array().items(
    Joi.object().keys({
      day: Joi.string().required().options({
        language: {
          any: {
            allowOnly: 'Please select a day'
          }
        }
      }),
      timezone: Joi.string().required().options({
        language: {
          any: {
            allowOnly: 'Please select a timezone'
          }
        }
      }),
      start_time: Joi.date().timestamp().required().options({
        language: {
          any: {
            allowOnly: 'Please select a start time'
          }
        }
      }),
      end_time: Joi.date().timestamp().required().options({
        language: {
          any: {
            allowOnly: 'Please enter an end time'
          }
        }
      })
    }))
};

class NewAvailability extends Component {
  constructor (props, context) {
    super(props, context);

    this.changeTimezoneHandler = this.changeTimezoneHandler.bind(this);
    this.changeDayHandler = this.changeDayHandler.bind(this);
    this.handleAddAvailability = this.handleAddAvailability.bind(this);
    this.handleRemoveAvailability = this.handleRemoveAvailability.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      numberOfAvailabilities: 1,
      error: ''
    }
  }

  render() {
    const { validateAllHandler } = this.props;
    return (
      <div>
        <Header currentUser={ this.props.currentUser } />

        <div className='availabilityContainer'>
          <ErrorField error={ this.state.error } />

          <RaisedButton label='Create All Availabilities' primary onClick={ validateAllHandler(this.handleSubmit) } />
          { this.renderAvailabilities() }
        </div>
      </div>
    );
  }

  handleSubmit() {
    const { errors } = this.props;

    if(!_.some(errors)) {
      const { availabilities } = this.props;
      return fetch('/availabilities', {
        method: 'POST',
        body: JSON.stringify({ availabilities: _.map(availabilities, (item) => item)} ),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRF-Token': this.getCSRFToken(),
        },
        credentials: 'same-origin'
      }).then(response => {
        if (response.status < 400) {

          return response.json().then(()=> {
            location.assign('/availabilities');
          });
        } else if (response.status < 500) {

          return response.json().then(({ message }) => {
            return this.setState({
              error: message
            });
          });
        }
      });
    }
  }

  renderAvailabilities() {
    const { numberOfAvailabilities } = this.state;
    const { errors, changeHandler, validateHandler, days, timezones } = this.props;

    return _.times(numberOfAvailabilities, (index) => {
      const availability = index;
      const { availabilities } = this.props;

      return (
        <form key={ index } className='newAvailabilityFormContainer'>
          <SelectField
            hintText='Select Timezone'
            value={ availabilities[index]? availabilities[index].timezone : 'UTC' }
            errorText={ _.get(errors, `${availability}.timezone`) }
            onChange={ this.changeTimezoneHandler(availability) }
            onBlur={ validateHandler(`${availability}.timezone`) }
            fullWidth
          >
            { _.map(timezones, ({ name, id }, index) => <MenuItem key={ name + id + index } insetChildren checked={ availabilities[index] && availabilities[index].timezone === name } value={ name } primaryText={ <span> { name } </span> } />) }
          </SelectField>

          <br />

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
            onDismiss={ validateHandler(`${availability}.start_time`) }
            fullWidth
          />

          <TimePicker
            format="24hr"
            hintText="End Time - 24Hr Format"
            value={ availabilities[index]? availabilities[index].end_time: {} }
            errorText={ _.get(errors, `${availability}.end_time`) }
            onChange={ changeHandler(`${availability}.end_time`) }
            onDismiss={ validateHandler(`${availability}.end_time`) }
            fullWidth
          />
          <FlatButton primary label='Add other availability' onClick={ this.handleAddAvailability } />
          { index === 0 ? null : <FlatButton primary label='Remove availability' onClick={ this.handleRemoveAvailability } /> }
        </form>
      );
    });
  }

  handleAddAvailability() {
    const { numberOfAvailabilities } = this.state;

    this.setState({
      numberOfAvailabilities: numberOfAvailabilities+1
    });
  }

  handleRemoveAvailability() {
    const { numberOfAvailabilities } = this.state;

    this.setState({
      numberOfAvailabilities: numberOfAvailabilities-1
    });
  }

  changeTimezoneHandler(path) {

    return (proxy, index, value) => {
      const { changeValue } = this.props;

      changeValue(`${path}.timezone`, value);
    };
  }

  changeDayHandler(path) {

    return (proxy, index, value) => {
      const { changeValue } = this.props;

      changeValue(`${path}.day`, value);
    };
  }

  getCSRFToken() {
    return _.find(document.getElementsByTagName('meta'), (meta) => {
      return meta.name === 'csrf-token';
    }).content;
  }
}


NewAvailability.propTypes = {
  errors: PropTypes.object,

  currentUser: PropTypes.shape({
    email: PropTypes.string,
  }),

  availabilities: PropTypes.shape({
    0: PropTypes.shape({
      start_time: PropTypes.object,
      end_time: PropTypes.object,
      day: PropTypes.string,
      timezone: PropTypes.string
    })
  }),
  days: PropTypes.array,
  changeHandler: PropTypes.func.isRequired,
  changeValue: PropTypes.func.isRequired,
  validateHandler: PropTypes.func.isRequired,
};

NewAvailability.defaultProps = {
  currentUser: {
    email: '',
  },
  errors: {},
  days: [],
  availabilities: {
    0: {
      start_time: {},
      end_time: {},
      day: '',
      timezone: ''
    }
  },
};

NewAvailability.contextTypes = {
  router: PropTypes.object
};

const validationOptions = {
  joiSchema: schema,
  only: 'availabilities',
  joiOptions: { allowUnknown: true },
};

export default validate(NewAvailability, validationOptions);

