import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import RaisedButton from '@material-ui/core/RaisedButton';
import FlatButton from '@material-ui/core/FlatButton';
import RefreshIndicator from '@material-ui/core/RefreshIndicator';

import { FormattedMessage } from 'react-intl';
import FloatingActionButton from '@material-ui/core/FloatingActionButton';
import EditIcon from '@material-ui/core/svg-icons/image/edit';
import METHODS from './utils/RestConstants';

import { postData } from './utils/sendData';
import AvailabilitiesTable from './AvailabilitiesTable';
import CommentContainer from './CommentContainer';
import ReviewContainer from './ReviewContainer';
import FormData from './utils/FormData';
import SnackBarComponent from './reusable/SnackBarComponent';

import formatLink from './utils/Link';
import isCurrentUserLocated from './utils/isCurrentUserLocated';

class UserProfile extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleReviewSubmit = this.handleReviewSubmit.bind(this);
    this.updateStars = this.updateStars.bind(this);
    this.handleViewProfileClick = this.handleViewProfileClick.bind(this);
    this.handleHideSnackBar = this.handleHideSnackBar.bind(this);

    const { review : { id } } = props;

    this.state = {
      comments: props.comments,
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
      id: id
    });
  }

  render() {
    return (
      <div>
        <Paper zDepth={ 1 } className='paperOverride userProfilePaper' rounded={ false }>
          { this.renderContent() }
        </Paper>
        { this.renderSnackBar() }
      </div>
    );

  }

  renderContent() {
    const { user } = this.props;
    if (!user.url_slug) {
      return (
        <div>
          { this.renderBackButton() }
          <div className='userProfileRefreshIndicator'>
            <RefreshIndicator
              size={ 50 }
              top={ 0 }
              left={ 0 }
              loadingColor="#FF9800"
              status='loading'
            />
          </div>
        </div>
      );
    } else {
      const {
        user,
        user: {
          url_slug,
          first_name,
          last_name,
          programs
        },
        currentUser: { locale },
        review
      } = this.props;
      const { comments } = this.state;
      return (
        <div>
          { this.renderBackButton() }
          { this.renderProfilePicture() }

          <div className='userProfileButtonAndDetailsContainer'>
            <Link to={ { pathname: '/messages/new', query: { recipient: url_slug, userName: first_name } } } className='userProfileLink'>
              <RaisedButton
                className='userProfileMessageButton'
                label={ (
                  <FormattedMessage
                    id='UserProfile.messageUser'
                    defaultMessage='Message User'
                  />
                ) }
                primary
              />
            </Link>

            <div className='userProfileReviewAndComment'>
              <ReviewContainer
                review={ review }
                onClick={ this.handleReviewSubmit }
              />
            </div>

            <div className='userProfileDetailsContainer'>
              <div className='userProfileLeftDetails'>
                <div className='userProfileField'>
                  <FormattedMessage
                    id='UserProfile.Name'
                    defaultMessage='Name'
                  />
                  :
                  <span>
                    {`${ first_name } ${ last_name }`} 
                  </span>
                </div>

                { this.renderLocation() }

                <div className='userProfileField'>
                  <FormattedMessage
                    id='UserProfile.programsOffered'
                    defaultMessage='Programs'
                  />: { programs? programs.join(', ') : '' }
                </div>

                <div className='userProfileField'>
                  <FormattedMessage
                    id='UserProfile.lastLogIn'
                    defaultMessage='Last logged in'
                  />: { user.last_logged_in}
                </div>

                <div className='userProfileField'>
                  <FormattedMessage
                    id='UserProfile.moreInformation'
                    defaultMessage='A bit more information'
                  />:
                  <span> { this.renderUserDescription() } </span>
                </div>
              </div>

              <div className='userProfileCommentContainer'>
                <CommentContainer
                  userId={ url_slug }
                  comments={ comments }
                  locale={ locale }
                />
              </div>
            </div>

            { this.renderAvailabilities() }

            <Link className='userProfileSendEmail' to={ { pathname: '/messages/new', query: { recipient: url_slug, userName: first_name } } }>
              <FloatingActionButton>
                <EditIcon />
              </FloatingActionButton>
            </Link>
          </div>
        </div>
      );
    }
  }

  renderBackButton() {
    return (
      <div className='userProfileBackButton'>
        <FlatButton
          primary
          label={ (
            <FormattedMessage
              id='UserProfile.Back'
              defaultMessage='Back to search results'
            />
          ) }
          onClick={ this.handleViewProfileClick }
        />
      </div>
    );
  }

  handleViewProfileClick() {
    const { history } = this.props;

    const { location: { state } } = this.props;

    if (state && state.search) {
      const { search, volunteers } = state;
      const { currentUser: { locale } } = this.props;

      history.push(formatLink('/volunteers', locale), { ...{ search }, volunteers });
    }
  }

  renderLocation() {
    const { currentUser } = this.props;

    if (isCurrentUserLocated(currentUser)) {
      return (
        <div className='userProfileField'>
          <FormattedMessage
            id='UserProfile.location'
            defaultMessage='Location'
          />:
          <span> { this.renderUserLocation() }</span>
        </div>
      );
    }
  }

  renderUserLocation() {
    const { user: { city, country, state } } = this.props;

    if (city || country || state) {
      return _.compact([ city, state, country ]).join(', ');
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
        <div className='userProfileImageContainer'>
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
    const { user: { url_slug }, review: { id }, currentUser: { locale } } = this.props;
    const { id: stateId } = this.state;

    const attributes = FormData.from({ review: _.toNumber(value), comment, user_id: url_slug, id });
    const method = id || this.state.id ? METHODS.PUT : METHODS.POST;

    const restfulUrl = function(){
      if (id) {
        if (locale) {
          return `/${locale}/reviews/${id}`;
        } else {
          return `/reviews/${id}`;
        }
      } else if (stateId) {
        if (locale) {
          return `/${locale}/reviews/${stateId}`;
        } else {
          return `/reviews/${stateId}`;
        }
      } else if (locale) {
        return `/${locale}/reviews`;
      } else {
        return '/reviews';
      }
    }();

    const requestParams = {
      url: restfulUrl,
      attributes,
      method,
      successCallBack: () => {
        location.reload();
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

  handleHideSnackBar() {
    this.setState({
      showSnackBar: false
    });
  }

  renderAvailabilities() {
    const { user: { timezone }, availabilities, currentUser: { locale } } = this.props;

    if ( _.size(availabilities) > 0 ) {
      return (
        <AvailabilitiesTable
          availabilities={ availabilities }
          timezone={ timezone }
          locale={ locale }
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
  }),
  currentUser: PropTypes.object.isRequired,
  availabilities: PropTypes.array,
  user: PropTypes.shape({
    programs: PropTypes.array,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    thumbnail_url: PropTypes.string,
    url_slug: PropTypes.string,
    last_logged_in: PropTypes.string,
    city: PropTypes.string,
    country: PropTypes.string,
    state: PropTypes.string,
    description: PropTypes.string,
    thumbnail_image: PropTypes.string,
    timezone: PropTypes.string,
  }),
  comments: PropTypes.shape({
    ten_last_comments: PropTypes.array,
    count: PropTypes.number
  }),
  history: PropTypes.object,
  location: PropTypes.shape({
    state: PropTypes.shape({
      volunteers: PropTypes.array,
      search: PropTypes.object
    })
  })
};

UserProfile.defaultProps = {
  availabilities: [],
  comments: {
    ten_last_comments: [],
    count: 0
  },
  user: {
    city: '',
    description: '',
  },
  review: {
    comment: ''
  },
  history: {},
  location: {
    state: {
      search: {}
    }
  }
};

export default UserProfile;
