import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

import Header from './Header';
import AvailabilitiesTable from './AvailabilitiesTable';

import './AvailabilityIndexPage.css';

const paperMarginOverride = {
  padding: '12px 24px 24px 24px',
  maxWidth: '950px',
  margin: '24px auto'
};

class AvailabilityIndexPage extends Component {
  render() {
    const { currentUser } = this.props;

    return (
      <div>
        <Header currentUser={ currentUser } />
        <Paper zDepth={ 1 } style={ paperMarginOverride } rounded={ false }>
          <div className='availabilityIndexContainer'>
            I can teach:
            <ul className='availabilityIndexListContainer'>
              { _.map(this.props.programs, ({ name }) => <li className='availabilityListItem' key={name}>{ name }</li>) }
            </ul>

            { this.renderAvailabilities() }
          </div>
        </Paper>
      </div>
    );
  }

  renderAvailabilities() {
    const { availabilities, currentUser: { timezone } } = this.props;

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
        <a href='/availabilities/new' >
          <RaisedButton primary label='Create new availabilities' className='conversationButton' />
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
