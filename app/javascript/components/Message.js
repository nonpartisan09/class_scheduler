import React, { Component } from 'react';
import PropTypes from 'prop-types';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Avatar from 'material-ui/Avatar';
import { Link } from 'react-router-dom';
import { ListItem } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { FormattedMessage } from 'react-intl';
import Divider from 'material-ui/Divider';

const iconButtonElement = (
  <IconButton
    touch
    tooltip='more'
    tooltipPosition='bottom-left'
  >
    <MoreVertIcon />
  </IconButton>
);

class Message extends Component {
  render() {
    const {
      newMessageFirstName,
      newMessageRecipient,
      sentOn,
      avatar,
      body
    } = this.props;

    const rightIconMenu = (
      <IconMenu iconButtonElement={ iconButtonElement } >
        <MenuItem>
          <Link className='conversationIndexPageLink' to={ { pathname: '/messages/new', query: { recipient: newMessageRecipient, userName: newMessageFirstName } } } >
            <FormattedMessage
              id='messageReply'
              defaultMessage='Reply'
            />
          </Link>
        </MenuItem>
        <MenuItem onClick={ this.handleReview(newMessageRecipient) }>
          <FormattedMessage
            id='conversationIndexPageReviewLink'
            defaultMessage='View Profile / Review'
          />
        </MenuItem>
      </IconMenu>
    );

    return (
      <div>
        <ListItem
          leftAvatar={ <Avatar src={ avatar } /> }
          rightIconButton={ rightIconMenu }
          primaryText={ this.renderSubject() }
          secondaryText={
            <p>
              { body }
            </p>
          }
          secondaryTextLines={ 2 }
        />
        <Divider key={ sentOn } inset />
      </div>
    );
  }

  handleReview(urlSlug) {
    return () => {
      location.assign(`/profiles/${urlSlug}`);
    };
  }

  renderSubject() {
    const { currentUserIsRecipient, unread, subject, sentOn } = this.props;
    const messageIsUnreadByRecipient = currentUserIsRecipient && unread;

    if (messageIsUnreadByRecipient && subject) {
      return (
        <span className='conversationIndexPageUnread'>
          { sentOn } - { subject }  - from { }
        </span>
      );
    } else if (subject) {
      return (
        <span>
          { sentOn } - { subject }
        </span>
      );
    } else {
      return '';
    }
  }
}

Message.propTypes = {
  currentUserIsRecipient: PropTypes.bool,
  unread: PropTypes.bool,
  newMessageFirstName: PropTypes.string,
  newMessageRecipient: PropTypes.string,
  sentOn: PropTypes.string,
  avatar: PropTypes.string,
  body: PropTypes.string,
  subject: PropTypes.string
};

Message.defaultProps = {
  currentUserIsRecipient: false,
  unread: false,
  subject: '',
  newMessageFirstName: '',
  newMessageRecipient: '',
  sentOn: '',
  avatar: '',
  body: ''
};

export default Message;
