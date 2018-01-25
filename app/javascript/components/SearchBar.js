import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import validate from 'react-joi-validation';
import { FormattedMessage } from 'react-intl';

import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';

import SearchValidationSchema from './schema/SearchValidationSchema';
import { getData } from './utils/sendData';
import Header from './reusable/Header';
import SearchOptionalFields from './SearchOptionalFields';

import './SearchBar.css';
import Footer from './reusable/Footer';
import SnackBarComponent from './reusable/SnackBarComponent';
import SearchUrl from './utils/SearchUrl';

class SearchBar extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.selectionRendererProgram = this.selectionRendererProgram.bind(this);
    this.selectionRendererDay = this.selectionRendererDay.bind(this);
    this.changeHandlerProgram = this.changeHandlerProgram.bind(this);
    this.changeHandlerDay = this.changeHandlerDay.bind(this);

    this.state = {
      error: '',
      status: 0,
      showSnackBar: false
    };
  }

  render() {
    const {
      days,
      programs,
      errors,
      changeHandler,
      changeValue,
      validateHandler,
      search: {
        distance,
        program,
        day,
        start_time,
        end_time
      },
      currentUser: {
        city,
        timezone
      } ,
      validateAllHandler
    } = this.props;

    return (
      <div>
        <Header currentUser={ this.props.currentUser } />
        { this.renderTitle() }

        <div className='searchBarTimezoneContainer'>
          <div className='searchBarTimezoneAndLink'>
            <TextField
              value={ timezone }
              className='searchBarTimezone'
              name='searchBarTimezone'
              disabled
            />

            <a href="/my_profile" className='slidingLink' >
              <FormattedMessage id='SearchBar.timezoneLink' defaultMessage='Not your timezone?' />
            </a>
          </div>
        </div>

        <div className='searchBarContainer'>
          <div className='searchBarOptionContainer'>
            <SelectField
              className='searchBarOption'
              hintText={ <FormattedMessage id='SearchBar.programs' defaultMessage='Program(s)' /> }
              value={ program }
              onChange={ this.changeHandlerProgram }
              multiple
              errorText={ errors.program }
              selectionRenderer={ this.selectionRendererProgram }
            >
              { _.map(programs, ({ name, id }) => {
                return <MenuItem key={ id } insetChildren checked={ _.indexOf(program, id) > -1 } value={ id } primaryText={ <span> { name } </span> } />;
              })}
            </SelectField>

            <SelectField
              hintText={ <FormattedMessage id='SearchBar.days' defaultMessage='Day(s)' /> }
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

          <RaisedButton
            onClick={ validateAllHandler(this.handleSubmit) }
            className='searchBarOption searchBarButton'
            label={ <FormattedMessage id='search' /> }
            primary
          />

          { this.renderResults() }
        </div>

        { this.renderSnackBar() }

        <Footer />
      </div>
    );
  }

  renderSnackBar() {
    if (this.state.showSnackBar) {
      return <SnackBarComponent open={ this.state.showSnackBar } message={ this.state.error } />;
    }
  }

  renderTitle() {
    const { location: { state }  } = this.props;

    if (state && state.signUp) {
      return (
        <h1 className='signUpHeader'>
          <FormattedMessage
            id='signUpHeader'
          />
        </h1>
      );
    }
  }

  renderResults() {
    const { status } = this.state;

    if (status === 204) {
      return (
        <div className='emptyVolunteerResults'>
          <FormattedMessage
            id='NewAvailability.noResultMessage'
            defaultMessage=' Sorry, it seems no volunteers match these filters.'
          />
        </div>
      );
    }
  }

  changeHandlerProgram(event, index, value) {
    const { changeValue } = this.props;
    changeValue('program', value, { validate: true });
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

  selectionRendererProgram(values) {
    const { programs } = this.props;
    if (_.size(values) > 1) {
      const newValues = _.map(programs, ({ name, id }) => {
        if ( _.indexOf(values, id) > -1) {
          return `${name}, `;
        }
      });

      return _.trimEnd(newValues.join(''), ', ');

    } else if (_.size(values) === 1) {
      return _.map(programs, ({ name, id }) => { if (_.indexOf(values, id) > -1) { return name; } });
    }
  }

  handleSubmit() {
    const { errors } = this.props;
    if (_.size(errors) === 0) {
      this.postSearch();
    }
  }

  postSearch() {
    const { search, history } = this.props;

    const requestParams = {
      url: SearchUrl(search),
      jsonBody: null,
      method: 'GET',
      successCallBack: (response, status) => {
        if (status === 204) {
          this.setState({
            status
          });
        } else {
         history.push('/available_volunteers',
           { ...response,
             ...{ search }
           });
        }
      },
      errorCallBack: (message) => {
        this.setState({
          showSnackBar: true,
          error: message
        });

        setTimeout(() => {
          this.handleHideSnackBar();
        }, 2000);
      }
    };

    return getData(requestParams);
  }
}

SearchBar.propTypes = {
  programs: PropTypes.array,
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
    program: PropTypes.array,
    distance: PropTypes.number,
    start_time: PropTypes.instanceOf(Date),
    end_time: PropTypes.instanceOf(Date),
  }),
  validateAllHandler: PropTypes.func.isRequired,
  validateHandler: PropTypes.func.isRequired,
  changeHandler: PropTypes.func.isRequired,
  changeValue: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    state: PropTypes.object
  })
};

SearchBar.defaultProps = {
  location: {
    state: {}
  },
  days: [],
  errors: {},
  programs: [],
  currentUser: {
    first_name: '',
    email: '',
    city: ''
  },
  search: {
    day: [],
    program: [],
    distance: 0,
  },
};

const validationOptions = {
  joiSchema: SearchValidationSchema,
  only: 'search',
  allowUnknown: true
};

export default validate(SearchBar, validationOptions);
