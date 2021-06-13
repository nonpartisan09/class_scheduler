import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import { FormattedMessage } from 'react-intl';
import Avatar from 'material-ui/Avatar';

import { List, ListItem } from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';

import formatLink from './utils/Link';
import PageHeader from './reusable/PageHeader';

class ConversationIndexPage extends Component {
  constructor(props, context) {
    super(props, context);
    this.untimelyConversation = false;
    this.handleClose = this.handleClose.bind(this);

    this.state = {
        showAlert: localStorage.getItem('showAlertInfo')
    };
  }

  render() {
    return (
      <div>
        <Paper zDepth={ 1 } className='paperOverride' rounded={ false }>
          <PageHeader title={ (
            <FormattedMessage
              id='ConversationIndexPage.header'
              defaultMessage='Inbox'
            />
            ) } />
          { this.renderAlertInfo() }
          <div className='conversationBox'>
            { this.renderInbox() }
            <p className="untimely-warning">{this.untimelyConversation ? '* Conversations outlined in red have messages received 48 hours ago and require a response.' : ''}</p>
          </div>
        </Paper>
      </div>
    );
  }

  renderAlertInfo() {
    if (localStorage.getItem('showAlertInfo') !== 'hidden' || this.state.showAlert !== 'hidden' ) {
        return (
          <div className='alert alertInfo'>
            <FormattedMessage
              id='ConversationIndexPage.alertInfo'
              defaultMessage=' Please note messages older than a month are automatically deleted.'
                />
            <span className='alertCloseButton' onClick={ this.handleClose }>
              <CloseIcon color='#0c5460' style={ { width: '20x', height: '20px' } } />
            </span>
          </div>
        );
    }
  }

  renderInbox() {
    const { conversations } = this.props;

    if (_.size(conversations) > 0 ) {
      return this.renderConversations();
    } else {
      const { currentUser: { volunteer, client, locale } } = this.props;
      const button = function(){
        if (client) {
          return (
            <a href={ formatLink('/search', locale) }>
              <RaisedButton
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
              <RaisedButton
                primary
                className='conversationButton'
                label={ (
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
          <Subheader>
            <FormattedMessage
              id='ConversationIndexPage.NoMessage'
              defaultMessage=' No Message Available'
            />
          </Subheader>
          { button }
        </List>
      );
    }
  }

  renderConversations() {
    const { conversations, currentUser } = this.props;

    return _.map(conversations, (conversation) => {
      const { conversee, id, conversee_avatar, is_first_message_unread, is_timely } = conversation;
      if (!is_timely && currentUser.volunteer) this.untimelyConversation = true;
      return (
        <ListItem
          className={ is_timely || !currentUser.volunteer ? '' : 'untimely-conversation' }
          onClick={ this.handleClick(id) }
          key={ conversee }
          leftAvatar={ <Avatar className='avatar' src={ conversee_avatar } /> }
          primaryText={ this.renderNewMessage({ conversee, is_first_message_unread }) }
        />
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
  conversations: PropTypes.oneOfType([ PropTypes.array, PropTypes.object ]),
  currentUser: PropTypes.shape({
    courses: PropTypes.array,
    first_name: PropTypes.string,
    address: PropTypes.string,
    city: PropTypes.string,
    email: PropTypes.string,
    password: PropTypes.string,
    password_confirmation: PropTypes.string,
    thumbnail_image: PropTypes.oneOfType([ PropTypes.string, PropTypes.object ]),
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
