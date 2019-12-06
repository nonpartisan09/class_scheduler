import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';
import { FormattedMessage } from 'react-intl';
import { CardActions } from 'material-ui/Card';
import { Link } from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';
import EmailIcon from 'material-ui/svg-icons/communication/email';

import formatLink from '../utils/Link';

export const MessageTypes = {
    REPLY: {
        id: 'MessageButtonItem.reply',
        default: 'Reply'
    },
    MESSAGE: {
        id: 'MessageButtonItem.message',
        default: 'Message'
    }
};


class MessageButtons extends Component {

  render() {
      const { locale, newMessageRecipient, newMessageFirstName, messageType, handleViewProfileClick } = this.props;
    return (
      <CardActions>
        <Link to={ { pathname: formatLink('/messages/new', locale), query: { recipient: newMessageRecipient, userName: newMessageFirstName } } }>
          <RaisedButton
            className='messageButtonItem'
            label={ (
              <span>
                <div className='searchResultItemRequestIcon'>
                  <EmailIcon color='white' />
                </div>
                <FormattedMessage
                  id={ messageType.id }
                  defaultMessage={ messageType.default }
                    />
              </span>
                ) }
            primary
            />
        </Link>
        <a href={ formatLink(`/profiles/${newMessageRecipient}`, locale) }>
          <FlatButton
            className='searchResultItemVisitProfile'
            label={ (
              <FormattedMessage
                id='SearchResultItem.viewProfile'
                defaultMessage='View Profile'
                />
                ) }
            primary
            onClick={ handleViewProfileClick }
            />
        </a>
      </CardActions>
        );
  }

}

MessageButtons.propTypes = {
    newMessageFirstName: PropTypes.oneOfType([ PropTypes.object, PropTypes.string ]),
    newMessageRecipient: PropTypes.any,
    locale: PropTypes.string,
    messageType: PropTypes.object
};

MessageButtons.defaultProps = {
    newMessageFirstName: '',
    newMessageRecipient: null,
    locale: '',
    messageType: {
        id: MessageTypes.MESSAGE.id,
        default: MessageTypes.MESSAGE.default
    }
};

export default MessageButtons;
