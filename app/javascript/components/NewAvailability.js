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
import TextField from 'material-ui/TextField';

import FormData from './utils/FormData';
import formatLink from './utils/Link';
import ErrorField from './reusable/ErrorField';
import { postData } from './utils/sendData';
import PageHeader from './reusable/PageHeader';

const styles = {
  selectLabelEnabled: {
    color: 'black'
  },
  selectLabelDisabled: {
    color: 'gray'
  }
};

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
    start_time: Joi.string().required().options({
      language: {
        string: {
          base:'Please select a start time',
          any:'Please select a start time',
          empty:'Please select a start time'
        }
      }
    }),
    end_time: Joi.string().required().options({
      language: {
        string: {
          base:'Please select an end time',
          any:'Please select an end time',
          empty:'Please select an end time'
        }
      }
    })
}));

class NewAvailability extends Component {
  constructor (props, context) {
    super(props, context);

    this.changeDayHandler = this.changeDayHandler.bind(this);
    this.handleAddAvailability = this.handleAddAvailability.bind(this);
    this.handleRemoveAvailability = this.handleRemoveAvailability.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleStartTimePickerChange = this.handleStartTimePickerChange.bind(this);
    this.handleEndTimePickerChange = this.handleEndTimePickerChange.bind(this);
    this.endTimePickerIsDisabled = this.endTimePickerIsDisabled.bind(this);
    this.generateEndTimeOptions = this. generateEndTimeOptions.bind(this);

    this.state = {
      numberOfAvailabilities: 1,
      error: { },
      days: props.days,
      endAvailabilities: [],
    };
  }

  render() {
    const {
      validateAllHandler,
      currentUser,
    } = this.props;

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

                <a href={ formatLink('/my_profile', currentUser.locale) } className='slidingLink'>
                  <FormattedMessage
                    id='NewAvailability.updateTimezone'
                    defaultMessage='Not your timezone?'
                />
                </a>
              </div>

              <RaisedButton
                className='addAvailabilitiesButton'
                label={ (
                  <FormattedMessage
                    id='NewAvailability.addAvailabilities'
                    defaultMessage='Create All Availabilities'
                  />
                  ) }
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
      return (
        <PageHeader title={ (
          <FormattedMessage
            id='NewAvailability.header'
            defaultMessage='Create your availabilities'
          />
          ) }
        />
      );
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
      const { availabilities, errors, availability_start_times, availability_end_times } = this.props;
      const currentAvailability = availabilities[index] || { };
      const { day, start_time, end_time } = currentAvailability;
      const { error, days, endAvailabilities } = this.state;

      const endTimePickerDisabled = this.endTimePickerIsDisabled(index);

      return (
        <div key={ index } className='availabilitiesContainer'>
          <div className='newAvailabilityErrorField'>
            <ErrorField error={ error && error[index] } />
          </div>

          <SelectField
            floatingLabelStyle={ styles.selectLabelEnabled }
            floatingLabelText={ (
              <FormattedMessage
                id='NewAvailability.selectDay'
                defaultMessage='Select Day'
              />
              ) }
            value={ currentAvailability? day: '' }
            errorText={ _.get(errors, `${index}.day`) }
            onChange={ changeHandler(`${index}.day`, { validate: true }) }
            onBlur={ validateAllHandler }
            fullWidth
          >
            { _.map(days, (value, index) => (
              <MenuItem
                key={ value + index }
                insetChildren
                checked={ availabilities[index] && availabilities[index].day === value }
                value={ index }
                primaryText={ (
                  <span> 
                    { value }
                  </span>
              ) } 
              />
            )) }
          </SelectField>

          <SelectField
            floatingLabelStyle={ styles.selectLabelEnabled }
            floatingLabelText={ (
              <FormattedMessage
                id='NewAvailability.selectStartTime'
                defaultMessage='select Start Time'
              />
              ) }        
            value={ currentAvailability? start_time : '' }
            errorText={ _.get(errors, `${index}.start_time`) }
            onChange={ this.handleStartTimePickerChange(index) }
            onBlur={ validateAllHandler }
            fullWidth
          >
            { _.map(Object.keys(availability_start_times), (value, index) => (
              <MenuItem
                key={ value + index }
                insetChildren
                value={ availability_start_times[value] }
                primaryText={ (
                  <span> 
                    { value }
                  </span>
              ) } 
              />
            )) }

          </SelectField>

          <SelectField
            floatingLabelStyle={ endTimePickerDisabled ? styles.selectLabelDisabled : styles.selectLabelEnabled }
            floatingLabelText={ (
              <FormattedMessage
                id='NewAvailability.selectEndTime'
                defaultMessage='Select End Time'
              />
              ) }        
            value={ currentAvailability? end_time : '' }
            errorText={ _.get(errors, `${index}.end_time`) }
            onChange={ this.handleEndTimePickerChange(index) }
            onBlur={ validateAllHandler }
            fullWidth
            disabled={ endTimePickerDisabled }
          >
            { _.map(Object.keys(endAvailabilities[index] ? endAvailabilities[index] : {} ), (value, index) => (
              <MenuItem
                key={ value + index }
                insetChildren
                value={ availability_end_times[value] }
                primaryText={ (
                  <span> 
                    { value }
                  </span>
              ) } 
              />
            )) }

          </SelectField>

          <FlatButton
            primary
            label={ (
              <FormattedMessage
                id='NewAvailability.addAvailability'
                defaultMessage='Add other availability'
              />
            ) }
            onClick={ this.handleAddAvailability }
          />
          { index === 0 ?
            null : (
              <FlatButton
                primary
                label={ <FormattedMessage id='NewAvailability.removeAvailability' defaultMessage='Remove availability' /> }
                onClick={ this.handleRemoveAvailability }
              />
            ) }
        </div>
      );
    });
  }

  handleStartTimePickerChange(availabilityIndex) {
    return (event, index, value) => {
      const { changeValues } = this.props;
      changeValues( [
        [`${availabilityIndex}.start_time`, value],
        [`${availabilityIndex}.end_time`, null]
      ] );

      this.generateEndTimeOptions(index, availabilityIndex);
    };
  }

  handleEndTimePickerChange(availabilityIndex) {
    return (event, index, value) => {
      const { changeValue } = this.props;
      changeValue(`${availabilityIndex}.end_time`, value);
    };
  }

  endTimePickerIsDisabled(index) {
    const { endAvailabilities } = this.state;
    return (!endAvailabilities || _.isEmpty(endAvailabilities[index]) );
  }

  generateEndTimeOptions(startIndex, availabilityIndex) {
    const { availability_end_times } = this.props;

    // Skip the next 15 mintue block, because the minimum session time is 30 minutes
    const first_end_availability = startIndex + 2;
    const validEndAvailabilities = {};

    Object.keys(availability_end_times).forEach( (availability, index) => {
      if (index >= first_end_availability) {
        validEndAvailabilities[availability] = availability_end_times[availability];
      }
    });
    
    this.setState((prevState) => {
      const newEndAvailabilities = prevState.endAvailabilities;
      newEndAvailabilities[availabilityIndex] = validEndAvailabilities;

      return { endAvailabilities: newEndAvailabilities };
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
    locale: PropTypes.string,
  }),

  availabilities: PropTypes.shape({
    0: PropTypes.shape({
      start_time: PropTypes.string,
      end_time: PropTypes.string,
      day: PropTypes.number,
    })
  }),
  days: PropTypes.array,
  changeHandler: PropTypes.func.isRequired,
  changeValue: PropTypes.func.isRequired,
  changeValues: PropTypes.func.isRequired,
  validateAllHandler: PropTypes.func.isRequired,
  validateAll: PropTypes.func.isRequired,
  location: PropTypes.shape({
    search: PropTypes.string,
  }),
  availability_start_times: PropTypes.object,
  availability_end_times: PropTypes.object,
};

NewAvailability.defaultProps = {
  currentUser: { },
  location: {
    search: ''
  },
  days: [],
  errors: {},
  availabilities: {
    0: {
      start_time: null,
      end_time: null,
      day: null,
    }
  },
  availability_start_times: {},
  availability_end_times: {},
};

NewAvailability.contextTypes = {
  router: PropTypes.object
};

const validationOptions = {
  joiSchema: schema,
  only: 'availabilities',
  allowUnknown: true,
};

export default validate(NewAvailability, validationOptions);

