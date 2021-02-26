import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import { FormattedMessage } from 'react-intl';

import { postData } from './utils/sendData';

import AvailabilitiesTable from './AvailabilitiesTable';
import formatLink from './utils/Link';

import PageHeader from './reusable/PageHeader';
import { ENGLISH } from './utils/availableLocales';

class AvailabilityIndexPage extends Component {

  render() {
    const { currentUser: { timeout, responsive }, availabilities: availabilities } = this.props;
    const isActive = responsive && !timeout;

    return (
      <div>
        <Paper zDepth={ 1 } className={ timeout || !responsive ? 'paperOverride untimelyResponses' : 'paperOverride' } rounded={ false }>
          <PageHeader title={ (
            <FormattedMessage
              id='AvailabilityIndexPage.Header'
              defaultMessage='My availabilities'
            />
            ) } 
          />

          <div className='availabilityIndexContainer'>
            <FormattedMessage
              id='AvailabilityIndexPage.Help'
              defaultMessage='I can help with'
            />
            :
            <ul className='availabilityIndexProgramsContainer'>
              { this.renderAvailablePrograms() }
            </ul>
            <div className={ isActive ? 'activeAvailabilities' : 'inactiveAvailabilities' }>
              <div>
                <FormattedMessage 
                  defaultMessage={ 'Availabilities are currently ' + isActive ? 'active.' : 'inactive.' }
                  id={ isActive ? 'AvailabilityIndexPage.ActiveAvailabilities' : 'AvailabilityIndexPage.InactiveAvailabilities' }
                />
                <FormattedMessage 
                  id={ responsive ? 'AvailabilityIndexPage.NoDisabledAvailabilitiesMessage' : 'AvailabilityIndexPage.DisabledAvailabilitiesMessage' }
                  defaultMessage={ responsive ? '' : ' To re-enable availabilities, please respond to all client volunteer requests that are more than two days old.' }
                />
              </div>
              &nbsp;&nbsp;
              {
                !!availabilities.length && (
                  <Button
                    variant='contained'
                    color='primary'
                    disabled={ !responsive }
                    onClick={ timeout || !responsive ? () => this.toggleAvailabilities(false) : () =>this.toggleAvailabilities(true) }
                  >
                    <FormattedMessage
                      id={ timeout || !responsive ? 'AvailabilityIndexPage.InactiveAvailabilitiesButton': 'AvailabilityIndexPage.ActiveAvailabilitiesButton' }
                      defaultMessage={ timeout || !responsive ? 'Reactivate Availabilities' : 'Deactivate Availabilities' }
                    />
                  </Button>
                )
              }
            </div>
            { this.renderAvailabilities() }
          </div>
        </Paper>
      </div>
    );
  }

  renderAvailablePrograms() {
    return _.map(this.props.programs, ({ name }) => (
      <li key={ name } className='availabilityListItem'>
        <Chip key={ name }>{ name }</Chip>
      </li>
      ));
  }

  renderAvailabilities() {
    const { availabilities, currentUser: { timezone, locale, timeout } } = this.props;

    if ( _.size(availabilities) > 0 ) {
      return (
        <ul className='availabilityIndexListContainer'>
          <AvailabilitiesTable
            availabilities={ availabilities }
            timezone={ timezone }
            locale={ locale }
            deletable
            timeout={ timeout }
          />
        </ul>
      );
    } else {
      return (
        <div>
          <a href={ formatLink('/availabilities/new', locale) }>
            <Button
              variant='contained'
              color='primary'
              className='conversationButton'
            >
              <FormattedMessage
                id='availabilityCreateNew'
                defaultMessage='Create new availabilities'
              />
            </Button>
          </a>
        </div>
      );
    }
  }

  toggleAvailabilities(timeout){
    const { currentUser: { locale, id } } = this.props;
    let url;

    url = `/${locale}/users?id=${id}&timeout=${timeout}`;

    const requestParams = {
      url: url,
      method: 'PUT',
      successCallBack: () => location.assign(formatLink('/availabilities', locale)),
      errorCallBack: (message) =>  console.log(message)
    };

    return postData(requestParams);

  }

}

AvailabilityIndexPage.propTypes = {
  availabilities: PropTypes.array,
  programs: PropTypes.array,
  currentUser: PropTypes.shape({
    first_name: PropTypes.string,
    email: PropTypes.string,
    timezone: PropTypes.string,
    locale: PropTypes.string,
    responsive: PropTypes.bool,
    timeout: PropTypes.bool,
    id: PropTypes.number
  })
};

AvailabilityIndexPage.defaultProps = {
  availabilities: [],
  programs: [],
  currentUser: {
    first_name: '',
    email: '',
    timezone: '',
    locale: ENGLISH,
    responsive: true,
    timeout: false,
    id: 0
  }
};

export default AvailabilityIndexPage;
