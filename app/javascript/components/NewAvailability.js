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

import Footer from './reusable/Footer';
import PageHeader from './reusable/PageHeader';

const nowDate = new Date();
const DEFAULT_START = _.toString(new Date(nowDate.setHours(0, 0)));
const DEFAULT_END = _.toString(new Date(nowDate.setHours(23, 59)));

const schema = Joi.object({}).pattern(/[0-9]+/, Joi.object({
    day: Joi.number().required().options({
      language: {
        number: {
          base: 'Please select a day',
          any: 'Please select a day',
          empty: 'Please select a day'
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

function validateTimes({ values, errors }, callback){
  _.each(values, (item, index) => {

    if (item.start_time && item.end_time) {
      const endTimeIsBeforeStartTime = item.end_time < item.start_time;
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
         _.set(errors, `${index}.start_time`, startTimeError);
         _.set(errors, `${index}.end_time`, endTimeError);
      }
    }

    if (item.start_time && !item.end_time) {
      return item.end_time = new Date(nowDate.setHours(23, 59));
    } else if (item.end_time && !item.start_time) {
      return item.start_time = new Date(nowDate.setHours(0, 0));
    }
  });

  callback({ values, errors });
}

class NewAvailability extends Component {
  constructor (props, context) {
    super(props, context);

    this.changeDayHandler = this.changeDayHandler.bind(this);
    this.handleAddAvailability = this.handleAddAvailability.bind(this);
    this.handleRemoveAvailability = this.handleRemoveAvailability.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    const days = props.location && props.location.state && props.location.state.days;

    this.state = {
      numberOfAvailabilities: 1,
      error: { },
      days: days || props.days
    };
  }

  render() {
    const {
      validateAllHandler,
      location: { state },
      currentUser: user
    } = this.props;

    const currentUser = function(){
      if (state) {
        return state.currentUser;
      } else {
        return user;
      }
    }();

      return (
        <div>
          <div className='availabilityContainer'>
            { this.renderTitle() }

            <form className='newAvailabilityFormContainer'>
              <div>
                <TextField
                  value={ currentUser.timezone }
                  className='newAvailabilityTimezone'
                  name='timezoneAvailability'
                  disabled
              />

                <a href={ formatLink('/my_profile', currentUser.locale) } className='slidingLink' >
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
         }
        />
      );
    }
  }

  handleSubmit() {
    const { validateAll } = this.props;

    validateAll(() => {
      const { errors } = this.props;

      if (_.size(errors) === 0) {
        const { availabilities, currentUser: { locale } } = this.props;

        const attributes = FormData.from({ availabilities });

        console.warn('attributes:');
        console.warn(attributes);

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
    });

  }

  renderAvailabilities() {
    const { numberOfAvailabilities } = this.state;
    const { changeHandler, validateAllHandler } = this.props;

    return _.times(numberOfAvailabilities, (index) => {
      const { availabilities, errors } = this.props;
      const currentAvailability = availabilities[index] || { };
      const { day, start_time, end_time } = currentAvailability;
      const { error, days } = this.state;

      return (
        <div key={ index } className='availabilitiesContainer' >
          <div className='newAvailabilityErrorField'>
            <ErrorField error={ error && error[index] } />
          </div>

          <SelectField
            hintText={
              <FormattedMessage
                id='NewAvailability.selectDay'
                defaultMessage='Select Day'
              />
            }
            value={ currentAvailability? day: '' }
            errorText={ _.get(errors, `${index}.day`) }
            onChange={ changeHandler(`${index}.day`, { validate: true }) }
            onBlur={ validateAllHandler }
            fullWidth
          >
            { _.map(days, (value, index) => <MenuItem key={ value + index } insetChildren checked={ availabilities[index] && availabilities[index].day === value } value={ index } primaryText={ <span> { value } </span> } />) }
          </SelectField>

          <TimePicker
            format='24hr'
            hintText={
              <FormattedMessage
                id='NewAvailability.selectStartTime'
                defaultMessage='Start Time - 24Hr Format'
              />
            }
            value={ currentAvailability? start_time : { } }
            errorText={ _.get(errors, `${index}.start_time`) }
            onChange={ changeHandler(`${index}.start_time`, {  validate: true }) }
            onDismiss={ validateAllHandler }
            autoOk
            fullWidth
          />

          <TimePicker
            format='24hr'
            hintText={
              <FormattedMessage
                id='NewAvailability.selectEndTime'
                defaultMessage='End Time - 24Hr Format'
              />
            }
            value={ currentAvailability? end_time : { } }
            errorText={ _.get(errors, `${index}.end_time`) }
            onChange={ changeHandler(`${index}.end_time`, {  validate: true }) }
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
          { index === 0 ?
            null :
            <FlatButton
              primary
              label={ <FormattedMessage id='NewAvailability.removeAvailability' defaultMessage='Remove availability' /> }
              onClick={ this.handleRemoveAvailability }
            />
          }
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
      day: PropTypes.number,
    })
  }),
  days: PropTypes.array,
  changeHandler: PropTypes.func.isRequired,
  changeValue: PropTypes.func.isRequired,
  validateAllHandler: PropTypes.func.isRequired,
  validateAll: PropTypes.func.isRequired,
  location: PropTypes.shape({
    state: PropTypes.object
  })
};

NewAvailability.defaultProps = {
  currentUser: { },
  location: {
    state: {}
  },
  days: [],
  errors: {},
  availabilities: {
    0: {
      start_time: {},
      end_time: {},
      day: null,
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

