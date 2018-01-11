import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import { FormattedMessage } from 'react-intl';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import EditIcon from 'material-ui/svg-icons/image/edit';

import METHODS from './RestConstants';

import { postData } from './sendData';
import AvailabilitiesTable from './AvailabilitiesTable';
import Header from './Header';

import './UserProfile.css';
import Footer from './Footer';
import FormData from './utils/FormData';
import SnackBarComponent from './reusable/SnackBarComponent';

class UserProfile extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleOnClick = this.handleOnClick.bind(this);
    this.updateStars = this.updateStars.bind(this);

    const { review : { review } } = props;

    this.state = {
      stars: review,
      showSnackBar: false,
      message: ''
    };
  }

  componentWillUpdate({ review: { review } }) {
    const { review:  { review: currentReview } } = this.props;

    if (currentReview !== review) {
      this.updateStars();
    }
  }

  updateStars() {
    const { review:  { review } } = this.props;

    this.setState({
      stars: review
    });
  }

  render() {
    const { user, currentUser, user: { url_slug, first_name } } = this.props;

    return (
      <div>
        <Header currentUser={ currentUser } />

        <Paper zDepth={ 1 } className='paperOverride' rounded={ false }>
          { this.renderProfilePicture() }

          <Link to={ { pathname: '/messages/new', query: { recipient: url_slug, userName: first_name } } } className='userProfileLink' >
            <RaisedButton
              className='userProfileMessageButton'
              label={
                <FormattedMessage
                  id='UserProfile.messageUser'
                  defaultMessage='Message User'
                />
              }
              primary
            />
          </Link>

          <div className='userProfileReview' >
            { this.renderReview() }
          </div>

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

        { this.renderSnackBar() }
        <Footer />
      </div>
    );
  }

  renderProfilePicture() {
    const { user: { thumbnail_image } } = this.props;

    return (
      <div className='userProfileImageContainer'  >
        <img src={ thumbnail_image } alt='User Profile' className='userProfileImage' />
      </div>
    );
  }

  renderReview() {
    const { stars } = this.state;

    return [
      _.times(5, (index) => {
        const className = function(){
          if (index < stars) {
            return 'userProfileStar userProfileStarSelected';
          } else {
            return 'userProfileStar';
          }
        }();

        return (
          <div onClick={ this.handleOnClick } key={ index } className={ className }>
            <label htmlFor={ `starRating${index}` } />
            <option
              value={ index + 1 }
              id={ `starRating${index}` }
            />
          </div>
        );
      })
    ];
  }

  renderSnackBar() {
    if (this.state.showSnackBar) {
      return <SnackBarComponent open={ this.state.showSnackBar } message={ this.state.message } />;
    }
  }

  handleOnClick({ target }) {
    if (target.value && target.value >= 0) {

      const { user: { url_slug }, review: { id } } = this.props;

      const attributes = FormData.from({ review: _.toNumber(target.value), user_id: url_slug, id });
      const method = id? METHODS.PUT : METHODS.POST;
      const restUrl = id? `/reviews/${id}` : '/reviews';

      const requestParams = {
        url: restUrl,
        attributes,
        method,
        successCallBack: () => {
          this.setState({
            stars: _.toNumber(target.value),
          });
        },

        errorCallBack: (message) => {
          this.setState({
            showSnackBar: true,
            message
          });
          this.resetForm();

          setTimeout(() => {
            this.handleHideSnackBar();
          }, 2000);
        }
      };

      return postData(requestParams);
    }
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
  review: PropTypes.shape({
    review: PropTypes.number.isRequired,
    id: PropTypes.any
  }).isRequired,
  currentUser: PropTypes.object.isRequired,
  user: PropTypes.shape({
    availabilities: PropTypes.array,
    programs: PropTypes.array.isRequired,
    first_name: PropTypes.string.isRequired,
    thumbnail_url: PropTypes.string,
    url_slug: PropTypes.string,
  }).isRequired,
};

UserProfile.defaultProps = {
};

export default UserProfile;
