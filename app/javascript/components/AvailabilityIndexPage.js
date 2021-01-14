import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import { FormattedMessage } from 'react-intl';

import AvailabilitiesTable from './AvailabilitiesTable';
import formatLink from './utils/Link';

import PageHeader from './reusable/PageHeader';
import { ENGLISH } from './utils/availableLocales';

class AvailabilityIndexPage extends Component {
  render() {
    return (
      <div>
        <Paper zDepth={ 1 } className='paperOverride' rounded={ false }>
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
            />:
            <ul className='availabilityIndexProgramsContainer'>
              { this.renderAvailablePrograms() }
            </ul>

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
    const { availabilities, currentUser: { timezone, locale } } = this.props;

    if ( _.size(availabilities) > 0 ) {
      return (
        <ul className='availabilityIndexListContainer'>
          <AvailabilitiesTable
            availabilities={ availabilities }
            timezone={ timezone }
            locale={ locale }
            deletable
          />
        </ul>
      );
    } else {
      return (
        <div>
          <a href={ formatLink('/availabilities/new', locale) }>
            <Button
              variant='contained'
              primary
              className='conversationButton'
              label={ (
                <FormattedMessage
                  id='availabilityCreateNew'
                  defaultMessage='Create new availabilities'
                />
                ) }
            />
          </a>
        </div>
      );
    }
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
  }
};

export default AvailabilityIndexPage;
