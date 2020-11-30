import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import QueryString from 'query-string';

import validate from 'react-joi-validation';
import { FormattedMessage } from 'react-intl';

import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';

import SearchValidationSchema from './schema/SearchValidationSchema';
import { getData } from './utils/sendData';
import SearchOptionalFields from './SearchOptionalFields';
import formatLink from './utils/Link';
import SnackBarComponent from './reusable/SnackBarComponent';
import SearchUrl from './utils/SearchUrl';
import PageHeader from './reusable/PageHeader';

import AvailabilitySelector from './AvailabilitySelector';

class SearchBar extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.selectionRendererProgram = this.selectionRendererProgram.bind(this);
    this.selectionRendererLanguage = this.selectionRendererLanguage.bind(this);
    this.changeHandlerProgram = this.changeHandlerProgram.bind(this);
    this.changeHandlerLanguage = this.changeHandlerLanguage.bind(this);
    this.changeHandlerDay = this.changeHandlerDay.bind(this);

    this.state = {
      error: '',
      status: 0,
      showSnackBar: false,
    };
  }
  render() {
    const {
      programs,
      languages,
      errors,
      changeHandler,
      changeValue,
      validateHandler,
      search: {
        distance,
        program,
        language,
        start_time,
        end_time,
        day,
      },
      currentUser: {
        city,
        timezone,
        locale
      },
      validateAllHandler,
      days,
    } = this.props;
  
    return (
      <div>
        { this.renderTitle() }

        <div className='searchBarContainer'>
          <TextField
            value={ timezone }
            className='searchBarTimezone'
            name='searchBarTimezone'
            disabled
          />

          <div className='searchBarTimezoneLink'>
            <a href={ formatLink('/my_profile', locale) } className='slidingLink'>
              <FormattedMessage
                id='SearchBar.timezoneLink'
                defaultMessage='Not your timezone?'
              />
            </a>
          </div>

          <SelectField
            className='searchBarOption'
            hintText={ (
              <FormattedMessage
                id='SearchBar.programs'
                defaultMessage='Program(s)'
              />
            ) }
            value={ program }
            onChange={ this.changeHandlerProgram }
            multiple
            errorText={ errors.program }
            selectionRenderer={ this.selectionRendererProgram }
          >
            { _.map(programs, ({ name, id }) => {
              return (
                <MenuItem 
                  key={ id } 
                  insetChildren 
                  checked={ _.indexOf(program, id) > -1 } 
                  value={ id } 
                  primaryText={ (
                    <span> 
                      { name } 
                    </span>
                  ) } 
                />
              );
            })}
          </SelectField>

          <SelectField
            className='searchBarOption'
            hintText={ (
              <FormattedMessage
                id='SearchBar.languages'
                defaultMessage='Language(s)'
              />
            ) }
            value={ language }
            onChange={ this.changeHandlerLanguage }
            multiple
            errorText={ errors.language }
            selectionRenderer={ this.selectionRendererLanguage }
          >
            { _.map(languages, ({ name, id }) => {
              return (
                <MenuItem 
                  key={ id } 
                  insetChildren 
                  checked={ _.indexOf(language, id) > -1 } 
                  value={ id } 
                  primaryText={ (
                    <span> 
                      { name } 
                    </span> 
                  ) } 
                />
              );
            })}
          </SelectField>

          <AvailabilitySelector 
            days={ days } 
            selectedDays={ day } 
            startTime={ start_time }
            endTime={ end_time }
            onChange={ this.changeHandlerAvailability }
            className='searchAvailabilityContainer'
            isAllDay
          />

          <SearchOptionalFields
            onChange={ changeHandler }
            changeValue={ changeValue }
            onBlur={ validateHandler }
            distance={ distance }
            city={ city }
            errors={ errors }
          />

          <RaisedButton
            onClick={ validateAllHandler(this.handleSubmit) }
            className='searchBarOption searchBarButton'
            label={ (
              <FormattedMessage
                id='search'
              /> 
            ) }
            primary
          />

          <div className='emptyVolunteerResults'>
            { this.renderResults() }
          </div>
        </div>

        { this.renderSnackBar() }
      </div>
    );
  }

  renderSnackBar() {
    if (this.state.showSnackBar) {
      return <SnackBarComponent open={ this.state.showSnackBar } message={ this.state.error } />;
    }
  }

  renderTitle() {
    const { location: { search }  } = this.props;
    const urlQueries = QueryString.parse(search);

    if (urlQueries.signup === 'true') {
      return (
        <div className='signUpHeader'>
          <PageHeader
            title={ (
              <FormattedMessage
                id='signUpHeader'
              />
            ) }
          />
        </div>
      );
    } else {
      return (
        <div className='searchBarHeaderContainer'>
          <PageHeader
            title={ (
              <FormattedMessage
                id='SearchBar.searchTitle'
                defaultMessage='Search for volunteers'
              />
            ) }
          />
        </div>
      );
    }
  }

  renderResults() {
    const { status } = this.state;

    if (status === 204) {
      return (
        <FormattedMessage
          id='NewAvailability.noResultMessage'
          defaultMessage=' Sorry, it seems no volunteers match these filters.'
        />
      );
    }
  }

  changeHandlerProgram(event, index, value) {
    const { changeValue } = this.props;
    changeValue('program', value, { validate: true });
  }

  changeHandlerLanguage(event, index, value) {
    const { changeValue } = this.props;
    changeValue('language', value, { validate: true });
  }

  changeHandlerDay(event, index, value) {
    const { changeValue } = this.props;
    changeValue('day', value, { validate: true });
  }

  changeHandlerAvailability = (availability) => {
    const { changeValues } = this.props;

    changeValues([ 
      ['day', availability.days],
      ['start_time', availability.startTime],
      ['end_time', availability.endTime]
    ] );
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

  selectionRendererLanguage(values) {
    const { languages } = this.props;
    if (_.size(values) > 1) {
      const newValues = _.map(languages, ({ name, id }) => {
        if ( _.indexOf(values, id) > -1) {
          return `${name}, `;
        }
      });

      return _.trimEnd(newValues.join(''), ', ');

    } else if (_.size(values) === 1) {
      return _.map(languages, ({ name, id }) => { if (_.indexOf(values, id) > -1) { return name; } });
    }
  }

  handleSubmit() {
    const { errors } = this.props;

    if (_.size(errors) === 0) {
      this.postSearch();
    }
  }

  postSearch() {
    const { search, history, currentUser: { locale } } = this.props;

    const requestParams = {
      url: SearchUrl({ ...search, locale }),
      jsonBody: null,
      method: 'GET',
      successCallBack: (response, status) => {
        if (status === 204) {
          this.setState({
            status
          });
        } else {
         history.push(formatLink('/volunteers', locale),
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
  languages: PropTypes.array,
  errors: PropTypes.object,
  days: PropTypes.array,
  currentUser: PropTypes.shape({
    first_name: PropTypes.string,
    email: PropTypes.string,
    city: PropTypes.string,
    start_time: PropTypes.object,
    end_time: PropTypes.object,
    locale: PropTypes.string,
    timezone: PropTypes.string,
  }),
  search: PropTypes.shape({
    day: PropTypes.array,
    program: PropTypes.array,
    language: PropTypes.array,
    distance: PropTypes.number,
    start_time: PropTypes.shape({
      hour: PropTypes.string,
      minute: PropTypes.string
    }),
    end_time: PropTypes.shape({
      hour: PropTypes.string,
      minute: PropTypes.string
    }),
  }),
  validateAllHandler: PropTypes.func.isRequired,
  validateHandler: PropTypes.func.isRequired,
  changeHandler: PropTypes.func.isRequired,
  changeValue: PropTypes.func.isRequired,
  changeValues: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string,
  })
};

SearchBar.defaultProps = {
  location: {
    search: ''
  },
  days: [],
  errors: {},
  programs: [],
  languages: [],
  currentUser: {
    first_name: '',
    email: '',
    city: ''
  },
  search: {
    day: [],
    program: [],
    language: [],
    distance: 0,
  },
};

const validationOptions = {
  joiSchema: SearchValidationSchema,
  only: 'search',
  allowUnknown: true
};

export default validate(SearchBar, validationOptions);
