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
import CommentContainer from './CommentContainer';

import ReviewContainer from './ReviewContainer';
import Footer from './Footer';
import FormData from './utils/FormData';
import SnackBarComponent from './reusable/SnackBarComponent';

import './UserProfile.css';

class UserProfile extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleReviewSubmit = this.handleReviewSubmit.bind(this);
    this.updateStars = this.updateStars.bind(this);

    const { review : { review, id } } = props;

    this.state = {
      stars: review,
      showSnackBar: false,
      message: '',
      id: id
    };
  }

  componentWillUpdate({ review: { review, id } }) {
    const { review:  { review: currentReview, id: currentId } } = this.props;

    if (currentReview !== review || currentId !== id) {
      this.updateStars(review, id);
    }
  }

  updateStars(review, id) {
    this.setState({
      stars: review,
      id: id
    });
  }

  render() {
    const { user, currentUser, user: { url_slug, first_name, ten_last_comments }, review } = this.props;

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

          <div className='userProfileReviewAndComment' >
            <ReviewContainer review={ review } onClick={ this.handleReviewSubmit } />
          </div>

          <div className='userProfileDetailsContainer'>
            <div className='userProfileLeftDetails'>
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
                <span> { this.renderUserLocation() }</span>
              </div>

              <div className='userProfileField'>
                <FormattedMessage
                  id='UserProfile.programsOffered'
                  defaultMessage='Programs:'
                /> { user && user.programs? user && user.programs.join(', ') : '' }
              </div>

              <div className='userProfileField'>
                <FormattedMessage
                  id='UserProfile.lastLogIn'
                  defaultMessage='Last logged in:'
                />
                <span> { user.last_logged_in} <FormattedMessage
                  id='ago'
                  defaultMessage='ago'
                />
                </span>
              </div>

              <div className='userProfileField'>
                <FormattedMessage
                  id='UserProfile.moreInformation'
                  defaultMessage='A bit more information:'
                />
                <span> { this.renderUserDescription() } </span>
              </div>
            </div>

            <div className='userProfileCommentContainer'>
              <CommentContainer userId={ url_slug } comments={ ten_last_comments } />
            </div>
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

  renderUserLocation() {
    const { user: { city } } = this.props;

    if (city) {
      return city;
    } else {
      return this.renderNotAvailable();
    }
  }

  renderUserDescription() {
    const { user: { description } } = this.props;

    if (description) {
      return description;
    } else {
      return this.renderNotAvailable();
    }
  }

  renderNotAvailable() {
    return(
      <FormattedMessage
        id='UserProfile.NotAvailable'
        defaultMessage='Not available'
      />
    );
  }

  renderProfilePicture() {
    const { user: { thumbnail_image } } = this.props;

    if (!_.isEmpty(thumbnail_image) && !_.endsWith(thumbnail_image, 'missing.png')) {
      return (
        <div className='userProfileImageContainer'  >
          <img src={ thumbnail_image } alt='User Profile' className='userProfileImage' />
        </div>
      );
    }
  }



  renderSnackBar() {
    if (this.state.showSnackBar) {
      return <SnackBarComponent open={ this.state.showSnackBar } message={ this.state.message } />;
    }
  }

  handleReviewSubmit(value, comment) {
    const { user: { url_slug }, review: { id } } = this.props;

    const attributes = FormData.from({ review: _.toNumber(value), comment, user_id: url_slug, id });
    const method = id || this.state.id ? METHODS.PUT : METHODS.POST;
    const restUrl = id || this.state.id ? `/reviews/${id||this.state.id}` : '/reviews';

    const requestParams = {
      url: restUrl,
      attributes,
      method,
      successCallBack: (response) => {
        const { review: { review, id } } = response;

        this.setState({
          stars: _.toNumber(review),
          id: id
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
    review: PropTypes.number,
    id: PropTypes.any,
    comment: PropTypes.string
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
  user: {
    city: '',
    description: '',
  },
  review: {
    comment: ''
  }
};

export default UserProfile;
