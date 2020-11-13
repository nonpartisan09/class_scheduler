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

const schema = Joi.object({}).pattern(/^[0-9]+$/, Joi.array().required().items(
  Joi.object({
  day: Joi.number().required().min(0).max(6).options({
    language: {
      number: {
        base: 'Please select a day',
        any: 'Please select a day',
        empty: 'Please select a day'
      }
    }
  }),
  start_time: Joi.string().required().regex(/^[0-2][0-9]:[0-5][0-9]$/).options({
    language: {
      string: {
        base:'Please select a start time',
        any:'Please select a start time',
        empty:'Please select a start time'
      }
    }
  }),
  end_time: Joi.string().required().regex(/^[0-2][0-9]:[0-5][0-9]$/).options({
    language: {
      string: {
        base:'Please select an end time',
        any:'Please select an end time',
        empty:'Please select an end time'
      }
    }
  })  
})));

class NewAvailability extends Component {
  constructor (props, context) {
    super(props, context);

    this.changeDayHandler = this.changeDayHandler.bind(this);
    this.handleAddAvailability = this.handleAddAvailability.bind(this);
    this.handleRemoveAvailability = this.handleRemoveAvailability.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      numberOfAvailabilities: 1,
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
        const { availabilities, currentUser: { locale } } = this.props;
        
        const availabilityMapping = new AvailabilitiesMapping(availabilities);
        const attributes = FormData.from( availabilityMapping.getFlattenedAvailabilities() );

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

  availabilityChangeHandler = ( index ) => (newAvailabilities) => {
    const { changeValue } = this.props;

    changeValue(`${index}`, newAvailabilities, { validate: true });
  }

  renderAvailabilities() {
    const { numberOfAvailabilities } = this.state;

    return _.times(numberOfAvailabilities, (index) => {
      const { error, days } = this.state;

      return (
        <div key={ index } className='availabilitiesContainer'>
          <div className='newAvailabilityErrorField'>
            <ErrorField error={ error && error[index] } />
          </div>

          <AvailabilitySelector 
            days={ days } 
            onChange={ this.availabilityChangeHandler(index) } 
          />

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
    0: PropTypes.array,
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
    0: [{
      start_time: null,
      end_time: null,
      day: null,
    }]
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
  // allowUnknown: true,
  // validator: validateAvailabilities
};

export default validate(NewAvailability, validationOptions);

