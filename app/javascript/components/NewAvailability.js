import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import Joi from 'joi-browser';
import validate from 'react-joi-validation';

import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import FormData from './utils/FormData';
import formatLink from './utils/Link';
import ErrorField from './reusable/ErrorField';
import { postData } from './utils/sendData';
import PageHeader from './reusable/PageHeader';

import AvailabilitySelector from './AvailabilitySelector';
import AvailabilitiesMapping from './utils/AvailabilitiesMapping';

const TIME_STRING_PATTERN = /^[0-2][0-9]:[0-5][0-9]$/;
const DEFAULT_AVAILABILITY = {
  startTime: {
    minute: '',
    hour: ''
  },
  endTime: {
    minute: '',
    hour: ''
  },
  day: [],
};

const schema = Joi.object({}).pattern(/^availabilities$/, Joi.array().required().min(1).items(Joi.object({
  days: Joi.array().required().items(Joi.number().required().min(0).max(6)).options({
    language: {
      number: {
        base: 'Please select a day',
        any: 'Please select a day',
        empty: 'Please select a day'
      }
    }
  }),
  startTime: Joi.object({
    hour: Joi.string().required().regex(/^[0-2][0-9]$/).options({
      language: {
        string: {
          base:'Please select an hour for the start time',
          any:'Please select an hour for the start time',
          empty:'Please select an hour for the start time'
        }
      }
    }),
    minute: Joi.string().required().regex(/^[0-5][0-9]$/).options({
      language: {
        string: {
          base:'Please select a minute for the start time',
          any:'Please select a minute for the start time',
          empty:'Please select a minute for the start time'
        }
      }
    }),      
  }),
  endTime: Joi.object({
    hour: Joi.string().required().regex(/^[0-2][0-9]$/).options({
      language: {
        string: {
          base:'Please select an hour for the end time',
          any:'Please select an hour for the end time',
          empty:'Please select an hour for the end time'
        }
      }
    }),
    minute: Joi.string().required().regex(/^[0-5][0-9]$/).options({
      language: {
        string: {
          base:'Please select a minute for the end time',
          any:'Please select a minute for the end time',
          empty:'Please select a minute for the end time'
        }
      }
    }),      
  }) 
})));

class NewAvailability extends Component {
  constructor (props, context) {
    super(props, context);

    this.handleAddAvailability = this.handleAddAvailability.bind(this);
    this.handleRemoveAvailability = this.handleRemoveAvailability.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      error: { },
      days: props.days
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
        const { currentUser: { locale } } = this.props;
        const { availabilities } = this.props.data;

        const availabilityMapping = new AvailabilitiesMapping(availabilities);
        const attributes = FormData.from( availabilityMapping.getExpandedAvailabilities() );

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
              error: availabilityMapping.getErrorsCorrectIndices(message)
            });
          }
        };

        return postData(requestParams);
      }
    });

  }

  availabilityChangeHandler = ( elementIndex ) => (newAvailability) => {
    const { changeValue } = this.props;
    const { availabilities } = this.props.data;
    const updatedAvailabilities = availabilities.map(
      (availability, index) => index === elementIndex ? newAvailability: availability);

    changeValue('availabilities', updatedAvailabilities, { validate: true } );
  }

  renderErrorMessageList = (errors) => {
    if(!Array.isArray(errors)) {
      return '';
    }
    return errors.map((error, index) => <ErrorField key={ index } error={ error } /> );
  };


  renderAvailabilities() {
    const { availabilities } = this.props.data;
    const numberOfAvailabilities = availabilities.length;

    return _.times(numberOfAvailabilities, (index) => {
      const { error, days } = this.state;
      const { errors } = this.props;
      const availability = availabilities[index];

      return (
        <div key={ index } className='availabilitiesContainer'>
          <AvailabilitySelector 
            days={ days }
            selectedDays={ availability.days } 
            startTime={ availability.startTime }
            endTime={ availability.endTime } 
            onChange={ this.availabilityChangeHandler(index) } 
          />
          
          <div className='newAvailabilityErrorField'>
            <ErrorField error={  (error && error[index]) } />
            {errors[index] ? this.renderErrorMessageList(Object.values(errors[index][0])) : null }
          </div>

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
                onClick={ () => this.handleRemoveAvailability(index) }
              />
            ) }
        </div>
      );
    });
  }

  handleAddAvailability() {
    const { pushValue } = this.props;
    pushValue('availabilities', DEFAULT_AVAILABILITY);
  }

  handleRemoveAvailability = ( indexToRemove ) => {
    const { changeValue } = this.props;
    const { availabilities } = this.props.data;
    const updatedAvailabilities = availabilities.filter( 
      (availability, index) => index !== indexToRemove
    );
    changeValue('availabilities', updatedAvailabilities );
  }
}


NewAvailability.propTypes = {
  errors: PropTypes.object,
  currentUser: PropTypes.shape({
    email: PropTypes.string,
    timezone: PropTypes.string,
    locale: PropTypes.string,
  }),
  data: PropTypes.shape({
    availabilities: PropTypes.array
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
  data: {
    availabilities: [ DEFAULT_AVAILABILITY ]
  },
  availability_start_times: {},
  availability_end_times: {},
};

NewAvailability.contextTypes = {
  router: PropTypes.object
};

const validationOptions = {
  joiSchema: schema,
  only: 'data',
  // validator: validateAvailabilities
};

export default validate(NewAvailability, validationOptions);

