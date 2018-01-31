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

import formatLink from './utils/Link';

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
    const { sentOn, avatar, body } = this.props;

    return (
      <div>
        <ListItem
          leftAvatar={ <Avatar src={ avatar } /> }
          rightIconButton={ this.renderRightIconMenu() }
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

  renderRightIconMenu() {
    const { newMessageRecipient } = this.props;

    if (newMessageRecipient) {
      const { newMessageFirstName, locale} = this.props;

      return (
        <IconMenu iconButtonElement={ iconButtonElement } >
          <MenuItem>
            <Link className='conversationIndexPageLink' to={ { pathname: formatLink('/messages/new', locale), query: { recipient: newMessageRecipient, userName: newMessageFirstName } } } >
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
    }
  }

  handleReview(urlSlug) {
    return () => {
      location.assign(`/profiles/${urlSlug}`);
    };
  }

  renderSubject() {
    const {  subject, sentOn, sender_first_name } = this.props;

    if (subject) {
      return (
        <p>
          <span>{ sentOn } - </span>
          <FormattedMessage
            id='Message.sentBy'
            defaultMessage='sent by'
          /> <span>{ sender_first_name }: </span>
          <span> { subject } </span>
        </p>

      );
    } else {
      return '';
    }
  }
}

Message.propTypes = {
  newMessageFirstName: PropTypes.oneOfType([ PropTypes.object, PropTypes.string ]),
  newMessageRecipient: PropTypes.any,
  sender_first_name: PropTypes.string,
  sentOn: PropTypes.string,
  avatar: PropTypes.string,
  body: PropTypes.string,
  subject: PropTypes.string,
  locale: PropTypes.string
};

Message.defaultProps = {
  subject: '',
  newMessageFirstName: '',
  newMessageRecipient: null,
  sender_first_name: '',
  sentOn: '',
  avatar: '',
  body: '',
  locale: ''
};

export default Message;
