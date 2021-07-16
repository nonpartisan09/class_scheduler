import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import ListSubheader from '@material-ui/core/ListSubheader';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles
      } from '@material-ui/core/styles';
import { FormattedMessage } from 'react-intl';
import Avatar from '@material-ui/core/Avatar';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';

import formatLink from './utils/Link';
import PageHeader from './reusable/PageHeader';

const ConversationAvatar = withStyles({
  root: {
    color: 'rgb(255, 255, 255)',
    backgroundColor: 'rgb(188, 188, 188)',
    userSelect: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    borderRadius: '50%',
    height: '40px',
    width: '40px', 
    position: 'absolute',
    top: '8px',
    left: '16px'
  },
})(Avatar);

class ConversationIndexPage extends Component {
  constructor(props, context) {
    super(props, context);
    this.untimelyConversation = false;
    this.untimelyConversation = props.currentUser.volunteer && props.conversations && props.conversations.some(convo => !convo.is_timely);
    console.log(props);
    console.log(this.untimelyConversation);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      showAlert: localStorage.getItem('showAlertInfo')
    };
  }


  

  render() {
    return (
      <div>
        <div className='paperOverride conversationIndexPageOverride'>
          <PageHeader title={ (
            <FormattedMessage
              id='ConversationIndexPage.header'
              defaultMessage='Inbox'
            />
          ) } />
          {this.renderAlertInfo()}
          <div className='conversationBox'>
            { this.renderInbox() }
            { this.renderError() }
          </div>
        </div>
      </div>
    );
  }

  renderError() {
    if (this.untimelyConversation) {
      return (
        <p className="untimely-warning">
          <FormattedMessage
            id='ConversationIndexPage.DeactivatedError'
            defaultMessage=' Please note messages older than a month are automatically deleted.'
          />
        </p>
      );
    }
  }

  renderAlertInfo() {
    if (localStorage.getItem('showAlertInfo') !== 'hidden' || this.state.showAlert !== 'hidden') {
      return (
        <div className='alert alertInfo'>
          <FormattedMessage
            id='ConversationIndexPage.alertInfo'
            defaultMessage=' Please note messages older than a month are automatically deleted.'
          />
          <span className='alertCloseButton' onClick={this.handleClose}>
            <CloseIcon color='#0c5460' style={{ width: '20x', height: '20px' }} />
          </span>
        </div>
      );
    }
  }

  renderInbox() {
    const { conversations } = this.props;

    if (_.size(conversations) > 0) {
      return this.renderConversations();
    } else {
      const { currentUser: { volunteer, client, locale } } = this.props;
      const button = function () {
        if (client) {
          return (
            <a href={ formatLink('/search', locale) }>
              <Button
                variant='contained'
                primary
                label={ (
                  <FormattedMessage
                    id='ConversationIndexPage.Search'
                    defaultMessage='Search for volunteers'
                  />
                ) }
                className='conversationButton'
              />
            </a>
          );
        } else if (volunteer) {
          return (
            <a href={ formatLink('/availabilities/new', locale) }>
              <Button
                variant='contained'
                primary
                className='conversationButton'
                label={(
                  <FormattedMessage
                    id='availabilityCreateNew'
                  />
                ) }
              />
            </a>
          );
        }
      }();
      return (
        <List>
          <ListSubheader>
            <FormattedMessage
              id='ConversationIndexPage.NoMessage'
              defaultMessage=' No Message Available'
            />
          </ListSubheader>
          { button}
        </List>
      );
    }
  }

  renderConversations() {
    const { conversations, currentUser } = this.props;

    return _.map(conversations, (conversation) => {
      const { conversee, id, conversee_avatar, is_first_message_unread, is_timely } = conversation;
      if (!is_timely) this.untimelyConversation = true;
      return (
        <div 
          className={ is_timely || !currentUser.volunteer ? '' : 'untimely-conversation' }
          onClick={ this.handleClick(id) }
          key={ conversee }
        >
          <span className='conversationIndexSpan'>
            <div className='conversationIndexDiv'>
              <ConversationAvatar className='avatar' src={ conversee_avatar } />
              <span>
                { this.renderNewMessage({ conversee, is_first_message_unread }) }
              </span>
            </div>
          </span>
          
        </div>
      );
    });
  }

  handleClick(id) {
    return () => {
      window.location.assign(`inbox/${id}`);
    };
  }

  renderNewMessage({ conversee, is_first_message_unread }) {
    if (is_first_message_unread) {
      return (
        <span className='conversationIndexPageUnread'>
          <FormattedMessage
            id='ConversationIndexPage.NewMessage'
            defaultMessage='Conversation with '
          />
          { conversee }
        </span>
      );
    } else {
      return (
        <span>
          <FormattedMessage
            id='ConversationIndexPage.NewMessage'
            defaultMessage='Conversation with '
          />
          { conversee }
        </span>
      );
    }
  }

  handleClose() {
    localStorage.setItem('showAlertInfo', 'hidden');

    this.setState({
      showAlert: 'hidden'
    });
  }
}

ConversationIndexPage.propTypes = {
  conversations: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  currentUser: PropTypes.shape({
    courses: PropTypes.array,
    first_name: PropTypes.string,
    address: PropTypes.string,
    city: PropTypes.string,
    email: PropTypes.string,
    password: PropTypes.string,
    password_confirmation: PropTypes.string,
    thumbnail_image: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    volunteer: PropTypes.bool,
    client: PropTypes.bool,
    locale: PropTypes.string,
  }),
};

ConversationIndexPage.defaultProps = {
  conversations: {
  },
  currentUser: {
    courses: [],
    address: '',
    city: '',
    first_name: '',
    email: '',
    password: '',
    password_confirmation: '',
    thumbnail_image: '',
  },
};

export default ConversationIndexPage;
