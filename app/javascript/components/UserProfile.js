import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Header from './Header';

class UserProfile extends Component {
  render() {
    const { user, current_user } = this.props;
    return (
      <div>
        <Header currentUser={ current_user } />

        <div>
          First Name: { user.first_name }
        </div>

        <div>
          Location: { user.city }
        </div>
        { this.renderAvailabilities() }
        <div>
          Teaching: { user && user.courses? user && user.courses.join(', ') : '' }
        </div>
      </div>
    );
  }

  renderAvailabilities() {
    const { user: { availabilities } } = this.props;

    if ( _.size(availabilities) > 0 ) {
      const displayAvailabilities = _.map(availabilities, ({ day, start_time, end_time, timezone }) => {
        return (
          <div>
            <div>
              { day }
            </div>
            <div>
              From { start_time } to { end_time }
            </div>
            <div>
              Timezone: { timezone }
            </div>
          </div>
        );
      });

      return (
        <div>
          Availabilities:
          { displayAvailabilities }
        </div>
      );
    }
  }
}

UserProfile.propTypes = {
  current_user: PropTypes.object.isRequired,
  user: PropTypes.shape({
    availabilities: PropTypes.array.isRequired,
    courses: PropTypes.array.isRequired,
    first_name: PropTypes.string.isRequired
  }).isRequired
};

UserProfile.defaultProps = {

};

export default UserProfile;
