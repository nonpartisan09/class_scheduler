import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Paper from 'material-ui/Paper';

import AvailabilitiesTable from './AvailabilitiesTable';
import Header from './Header';
import './UserProfile.css';

const paperMarginOverride = {
  padding: '12px 24px 24px 24px',
  maxWidth: '950px',
  margin: '24px auto'
};

class UserProfile extends Component {
  render() {
    const { user, current_user } = this.props;
    return (
      <div>
        <Header currentUser={ current_user } />

        <Paper zDepth={ 1 } style={ paperMarginOverride } rounded={ false }>
          { this.renderProfilePicture() }

          <div className='userProfileField'>
            First name: { user.first_name }
          </div>

          <div className='userProfileField'>
            Location: { user.city }
          </div>

          <div className='userProfileField'>
            Can teach: { user && user.courses? user && user.courses.join(', ') : '' }
          </div>

          <div className='userProfileField'>
            Last active: { user.last_logged_in} ago
          </div>

          <div className='userProfileField'>
            A bit more about { user.first_name }: { user.description }
          </div>

          { this.renderAvailabilities() }

        </Paper>
      </div>
    );
  }

  renderProfilePicture() {
    const { user: { thumbnail_image } } = this.props;

    return (
      <div className='userProfileImage'  >
        <img src={ thumbnail_image } alt='User Profile' />
      </div>
    );
  }

  renderAvailabilities() {
    const { user: { availabilities } } = this.props;

    if ( _.size(availabilities) > 0 ) {
      return (
        <AvailabilitiesTable
          availabilities={ availabilities }
        />
      );
    }
  }
}

UserProfile.propTypes = {
  current_user: PropTypes.object.isRequired,
  user: PropTypes.shape({
    availabilities: PropTypes.array.isRequired,
    courses: PropTypes.array.isRequired,
    first_name: PropTypes.string.isRequired,
    thumbnail_url: PropTypes.string
  }).isRequired
};

UserProfile.defaultProps = {

};

export default UserProfile;
