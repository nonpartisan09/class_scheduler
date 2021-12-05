import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { FormattedMessage } from 'react-intl';
import CardActions from '@material-ui/core/CardActions';
import { Link } from 'react-router-dom';
import EmailIcon from '@material-ui/icons/Email';

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
    const { locale, newMessageRecipient, newMessageFirstName, messageType, handleViewProfileClick  } = this.props;
    return (
      <CardActions className="message-buttons">
        <Link to={ { pathname: formatLink('/messages/new', locale), query: { recipient: newMessageRecipient, userName: newMessageFirstName } } }>
          <Button
            className='messageButtonItem'
            variant='contained'
            primary
          >
            <span>
              <div className='searchResultItemRequestIcon'>
                <EmailIcon color='white' />
              </div>
              <FormattedMessage
                id={ messageType.id }
                defaultMessage={ messageType.default }
                    />
            </span>
          </Button>
        </Link>
        <Button
          className='searchResultItemVisitProfile'
          primary
          onClick={ handleViewProfileClick }
          href={ formatLink(`/profiles/${newMessageRecipient}`, locale) }
          >
          <FormattedMessage
            id='SearchResultItem.viewProfile'
            defaultMessage='View Profile'
             /> 
        </Button>
      </CardActions>
        );
  }

}

MessageButtons.propTypes = {
    newMessageFirstName: PropTypes.oneOfType([ PropTypes.object, PropTypes.string ]),
    newMessageRecipient: PropTypes.any,
    locale: PropTypes.string,
    messageType: PropTypes.object,
    handleViewProfileClick: PropTypes.func,
};

MessageButtons.defaultProps = {
    newMessageFirstName: '',
    newMessageRecipient: null,
    locale: '',
    messageType: {
        id: MessageTypes.MESSAGE.id,
        default: MessageTypes.MESSAGE.default
    },
    handleViewProfileClick: () => {},
};

export default MessageButtons;
