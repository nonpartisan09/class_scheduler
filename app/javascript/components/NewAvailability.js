import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import Joi from 'joi-browser';
import validate from 'react-joi-validation';

import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TimePicker from 'material-ui/TimePicker';
import TextField from 'material-ui/TextField';

import FormData from './utils/FormData';
import formatLink from './utils/Link';

import Header from './reusable/Header';
import ErrorField from './reusable/ErrorField';
import { postData } from './utils/sendData';

import './NewAvailability.css';
import Footer from './reusable/Footer';
import PageHeader from './reusable/PageHeader';

const nowDate = new Date();
const DEFAULT_START = _.toString(new Date(nowDate.setHours(0, 0)));
const DEFAULT_END = _.toString(new Date(nowDate.setHours(23, 59)));

const schema = Joi.object({}).pattern(/[0-9]+/, Joi.object({
    day: Joi.number().required().options({
      language: {
        any: 'Please select a day',
        empty: 'Please select a day'
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
            const startTimeError =
              (<FormattedMessage
                id='NewAvailability.startTimeError'
                defaultMessage='Please select a start time chronologically before end time'
              />);

              const endTimeError =
                (<FormattedMessage
                  id='NewAvailability.endTimeError'
                  defaultMessage='Please select an end time chronologically after start time'
              />);

            if (endTimeIsBeforeStartTime) {
              if (_.endsWith(item, 'start_time')) { _.set(errors, `${index}.start_time`, startTimeError); }
              if (_.endsWith(item, 'end_time')) { _.set(errors, `${index}.end_time`, endTimeError); }
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

    this.changeDayHandler = this.changeDayHandler.bind(this);
    this.handleAddAvailability = this.handleAddAvailability.bind(this);
    this.handleRemoveAvailability = this.handleRemoveAvailability.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      numberOfAvailabilities: 1,
      error: ''
    };
  }

  render() {
    const {
      validateAllHandler,
      currentUser,
      currentUser: {
        timezone,
        locale
      }
    } = this.props;

    return (
      <div>
        <Header currentUser={ currentUser } />

        <div className='availabilityContainer'>
          { this.renderTitle() }
          <ErrorField error={ this.state.error } />

          <form className='newAvailabilityFormContainer'>
            <div>
              <TextField
                value={ timezone }
                className='newAvailabilityTimezone'
                name='timezoneAvailability'
                disabled
              />

              <a href={ formatLink('/my_profile', locale) } className='slidingLink' >
                <FormattedMessage
                  id='NewAvailability.updateTimezone'
                  defaultMessage='Not your timezone?'
                />
              </a>
            </div>

            <RaisedButton
              className='addAvailabilitiesButton'
              label={
                <FormattedMessage
                  id='NewAvailability.addAvailabilities'
                  defaultMessage='Create All Availabilities'
                />
              }
              primary
              onClick={ validateAllHandler(this.handleSubmit) }
            />

            { this.renderAvailabilities() }
          </form>
        </div>
        <Footer />
      </div>
    );
  }

  renderTitle() {
    const { location: { state }  } = this.props;

    if (state && state.signUp) {
      return (
        <h1 className='signUpHeader'>
          <FormattedMessage
            id='signUpHeader'
            defaultMessage='Join Tutoría community: Step 2/2'
          />
        </h1>
      );
    } else {
      return (
        <PageHeader title={
          <FormattedMessage
            id='NewAvailability.header'
            defaultMessage='Create your availabilities'
          />
        }/>
      );
    }
  }

  handleSubmit() {
    const { errors, validateAllHandler } = this.props;

    validateAllHandler();

    if (_.size(errors) === 0) {
      const { availabilities, currentUser: { locale } } = this.props;

      const attributes = FormData.from({ availabilities });
      const requestParams = {
        url: '/availabilities',
        attributes,
        method: 'POST',
        successCallBack: () => {
          location.assign(formatLink('/availabilities', locale));
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
            hintText={
              <FormattedMessage
                id='NewAvailability.selectDay'
                defaultMessage='Select Day'
              />
            }
            value={ availabilities[index]? availabilities[index].day: {} }
            errorText={ _.get(errors, `${availability}.day`) }
            onChange={ this.changeDayHandler(availability) }
            onBlur={ validateHandler(`${availability}.day`) }
            fullWidth
          >
            { _.map(days, (value, index) => <MenuItem key={ value + index } insetChildren checked={ availabilities[index] && availabilities[index].day === value } value={ index } primaryText={ <span> { value } </span> } />) }
          </SelectField>

          <TimePicker
            format="24hr"
            hintText={
              <FormattedMessage
                id='NewAvailability.selectStartTime'
                defaultMessage='Start Time - 24Hr Format'
              />
            }
            value={ availabilities[index]? availabilities[index].start_time: {} }
            errorText={ _.get(errors, `${availability}.start_time`) }
            onChange={ changeHandler(`${availability}.start_time`) }
            onDismiss={ validateAllHandler }
            autoOk
            fullWidth
          />

          <TimePicker
            format="24hr"
            hintText={
              <FormattedMessage
                id='NewAvailability.selectEndTime'
                defaultMessage='End Time - 24Hr Format'
              />
            }
            value={ availabilities[index]? availabilities[index].end_time: {} }
            errorText={ _.get(errors, `${availability}.end_time`) }
            onChange={ changeHandler(`${availability}.end_time`) }
            onDismiss={ validateAllHandler }
            autoOk
            fullWidth
          />
          <FlatButton
            primary
            label={
              <FormattedMessage
                id='NewAvailability.addAvailability'
                defaultMessage='Add other availability'
              />
            }
            onClick={ this.handleAddAvailability }
          />
          { index === 0 ? null : <FlatButton primary label={ <FormattedMessage id='NewAvailability.removeAvailability' defaultMessage='Remove availability' /> } onClick={ this.handleRemoveAvailability } /> }
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

  changeDayHandler(path) {

    return (proxy, index, value) => {
      const { changeValue } = this.props;

      changeValue(`${path}.day`, value);
    };
  }
}


NewAvailability.propTypes = {
  errors: PropTypes.object,
  currentUser: PropTypes.shape({
    email: PropTypes.string,
    timezone: PropTypes.string,
  }),

  availabilities: PropTypes.shape({
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
  location: PropTypes.shape({
    state: PropTypes.object
  })
};

NewAvailability.defaultProps = {
  currentUser: {
    email: '',
    timezone: 'UTC',
  },
  location: {
    state: {}
  },
  errors: {},
  days: [],
  availabilities: {
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

