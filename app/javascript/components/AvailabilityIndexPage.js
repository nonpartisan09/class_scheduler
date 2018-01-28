import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import Chip from 'material-ui/Chip';
import { FormattedMessage } from 'react-intl';

import Header from './reusable/Header';
import AvailabilitiesTable from './AvailabilitiesTable';
import formatLink from './utils/Link';

import './AvailabilityIndexPage.css';

class AvailabilityIndexPage extends Component {
  render() {
    const { currentUser } = this.props;

    return (
      <div>
        <Header currentUser={ currentUser } />
        <Paper zDepth={ 1 } className='paperOverride' rounded={ false }>
          <div className='availabilityIndexContainer'>
            <FormattedMessage
              id='AvailabilityIndexPage.Help'
              defaultMessage='I can help with:'
            />
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
    return _.map(this.props.programs, ({ name }) =>
      <li key={ name } className='availabilityListItem'>
        <Chip key={ name }>{ name }</Chip>
      </li>
    );
  }

  renderAvailabilities() {
    const { availabilities, currentUser: { timezone, locale } } = this.props;

    if ( _.size(availabilities) > 0 ) {
      return (
        <ul className='availabilityIndexListContainer'>
          <AvailabilitiesTable
            availabilities={ availabilities }
            timezone={ timezone }
            deletable
          />
        </ul>
      );
    } else {
      return (
        <a href={ formatLink('/availabilities/new', locale) } >
          <RaisedButton primary className='conversationButton' >
            <FormattedMessage
              id='availabilityCreateNew'
              defaultMessage='Create new availabilities'
            />
          </RaisedButton>
        </a>
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
    timezone: PropTypes.string
  })
};

AvailabilityIndexPage.defaultProps = {
  availabilities: [],
  programs: [],
  currentUser: {
    first_name: '',
    email: '',
    timezone: ''
  }
};

export default AvailabilityIndexPage;
