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

import Footer from './reusable/Footer';
import formatLink from './utils/Link';
import SnackBarComponent from './reusable/SnackBarComponent';
import SearchUrl from './utils/SearchUrl';
import PageHeader from './reusable/PageHeader';

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

  renderDays() {
    const { errors, search: { day }, location: { state } } = this.props;

    if (state && state.days) {
      return (
        <SelectField
          className='searchBarOption'
          hintText={
            <FormattedMessage
              id='SearchBar.days'
              defaultMessage='Day(s)'
            />
          }
          value={ day }
          errorText={ errors.day }
          onChange={ this.changeHandlerDay }
          multiple
          selectionRenderer={ this.selectionRendererDay }
        >
          { _.map(state.days, (value, index) => <MenuItem key={ value + index } insetChildren checked={ _.indexOf(day, index) > -1 } value={ index } primaryText={ <span> { value } </span> } />) }
        </SelectField>
      );
    } else {
      const { days } = this.props;

      return (
        <SelectField
          className='searchBarOption'
          hintText={
            <FormattedMessage
              id='SearchBar.days'
              defaultMessage='Day(s)'
            />
          }
          value={ day }
          errorText={ errors.day }
          onChange={ this.changeHandlerDay }
          multiple
          selectionRenderer={ this.selectionRendererDay }
        >
          { _.map(days, (value, index) => <MenuItem key={ value + index } insetChildren checked={ _.indexOf(day, index) > -1 } value={ index } primaryText={ <span> { value } </span> } />) }
        </SelectField>
      );
    }
  }

  render() {
    const {
      programs,
      errors,
      changeHandler,
      changeValue,
      validateHandler,
      search: {
        distance,
        program,
        start_time,
        end_time
      },
      currentUser: {
        city,
        timezone,
        locale
      },
      location: { state },
      validateAllHandler
    } = this.props;

    return (
      <div>
        <Header currentUser={ this.props.currentUser } />
        { this.renderTitle() }

        <div className='searchBarContainer'>
          <TextField
            value={ state && state.currentUser.timezone || timezone }
            className='searchBarTimezone'
            name='searchBarTimezone'
            disabled
          />

          <div className='searchBarTimezoneLink'>
            <a href={ formatLink('/my_profile', locale) } className='slidingLink' >
              <FormattedMessage
                id='SearchBar.timezoneLink'
                defaultMessage='Not your timezone?'
              />
            </a>
          </div>

          <SelectField
            className='searchBarOption'
            hintText={
              <FormattedMessage
                id='SearchBar.programs'
                defaultMessage='Program(s)'
              />
            }
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

          { this.renderDays() }

          <SearchOptionalFields
            onChange={ changeHandler }
            changeValue={ changeValue }
            onBlur={ validateHandler }
            start_time={ start_time }
            end_time={ end_time }
            distance={ distance }
            city={ city }
            errors={ errors }
          />

          <RaisedButton
            onClick={ validateAllHandler(this.handleSubmit) }
            className='searchBarOption searchBarButton'
            label={
              <FormattedMessage
                id='search'
              /> }
            primary
          />

          <div className='emptyVolunteerResults'>
            { this.renderResults() }
          </div>
        </div>

        { this.renderSnackBar() }

        <Footer className='footerContainerFixed' />
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
        <div className='signUpHeader'>
          <PageHeader
            title={
              <FormattedMessage
                id='signUpHeader'
              />
            }
          />
        </div>
      );
    } else {
      return (
        <div className='searchBarHeaderContainer'>
          <PageHeader
            title={
              <FormattedMessage
                id='SearchBar.searchTitle'
                defaultMessage='Search for volunteers'
              />
            }
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

  changeHandlerDay(event, index, value) {
    const { changeValue } = this.props;
    changeValue('day', value, { validate: true });
  }

  selectionRendererDay(values) {
    const { days } = this.props;

    if (_.size(values) > 1) {
      return _.trimEnd(_.map(values, (value) => {
        return days[value];
      }).join(', '), ', ');
    } else if (_.size(values) === 1) {
      return days[values];
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
