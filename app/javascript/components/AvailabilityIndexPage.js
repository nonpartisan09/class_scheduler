import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
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
    return (
      <div>
        <Header currentUser={ this.props.currentUser } />
        <Paper zDepth={ 1 } style={ paperMarginOverride } rounded={ false }>
          <div className='availabilityIndexContainer'>
            I can teach:
            <ul className='availabilityIndexListContainer'>
              { _.map(this.props.courses, ({ name }) => <li className='availabilityListItem' key={name}>{ name }</li>) }
            </ul>

            <br />
            <ul className='availabilityIndexListContainer'>
              { this.renderAvailabilities() }
            </ul>
          </div>
        </Paper>
      </div>
    );
  }

  renderAvailabilities() {
    const { availabilities } = this.props;

    if ( _.size(availabilities) > 0 ) {
      return (
        <AvailabilitiesTable
          availabilities={ availabilities }
        />
      );
    }
  }
}

AvailabilityIndexPage.propTypes = {
  availabilities: PropTypes.array,
  courses: PropTypes.array,
  currentUser: PropTypes.shape({
    first_name: PropTypes.string,
    email: PropTypes.string,
  })
};

AvailabilityIndexPage.defaultProps = {
  availabilities: [],
  courses: [],
  currentUser: {
    first_name: '',
    email: '',
  }
};

export default AvailabilityIndexPage;
