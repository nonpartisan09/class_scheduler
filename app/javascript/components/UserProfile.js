import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import { FormattedMessage } from 'react-intl';

import { Link } from 'react-router-dom';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import EditIcon from 'material-ui/svg-icons/image/edit';

import AvailabilitiesTable from './AvailabilitiesTable';
import Header from './Header';
import './UserProfile.css';

const paperMarginOverride = {
  padding: '12px 24px 24px 24px',
  maxWidth: '950px',
  margin: '24px auto',
  position: 'relative'
};

class UserProfile extends Component {
  render() {
    const { user, currentUser, user: { url_slug, first_name } } = this.props;
    return (
      <div>
        <Header currentUser={ currentUser } />

        <Paper zDepth={ 1 } style={ paperMarginOverride } rounded={ false }>
          { this.renderProfilePicture() }

          <Link to={ { pathname: '/messages/new', query: { recipient: url_slug, userName: first_name } } } className='userProfileLink' >
            <RaisedButton
              label={
                <FormattedMessage
                  id='UserProfile.messageUser'
                  defaultMessage='Message User'
                />
              }
              primary
            />
          </Link>

          <div className='userProfileField'>
            <FormattedMessage
              id='UserProfile.firstName'
              defaultMessage='First Name:'
            />
            <span> { user.first_name }</span>
          </div>

          <div className='userProfileField'>
            <FormattedMessage
              id='UserProfile.location'
              defaultMessage='Location:'
            />
            <span> { user.city }</span>
          </div>

          <div className='userProfileField'>
            Programs offered: { user && user.programs? user && user.programs.join(', ') : '' }
          </div>

          <div className='userProfileField'>
            Last active: { user.last_logged_in} ago
          </div>

          <div className='userProfileField'>
            A bit more about { user.first_name }: { user.description }
          </div>

          { this.renderAvailabilities() }

          <Link className='userProfileSendEmail' to={ { pathname: '/messages/new', query: { recipient: url_slug, userName: first_name } } } >
            <FloatingActionButton>
              <EditIcon />
            </FloatingActionButton>
          </Link>
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
    const { user: { availabilities, timezone } } = this.props;

    if ( _.size(availabilities) > 0 ) {
      return (
        <AvailabilitiesTable
          availabilities={ availabilities }
          timezone={ timezone }
        />
      );
    }
  }
}

UserProfile.propTypes = {
  currentUser: PropTypes.object.isRequired,
  user: PropTypes.shape({
    availabilities: PropTypes.array.isRequired,
    programs: PropTypes.array.isRequired,
    first_name: PropTypes.string.isRequired,
    thumbnail_url: PropTypes.string,
    url_slug: PropTypes.string,
  }).isRequired,
};

UserProfile.defaultProps = {
};

export default UserProfile;
