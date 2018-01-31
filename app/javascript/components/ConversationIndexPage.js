import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import { FormattedMessage } from 'react-intl';
import Avatar from 'material-ui/Avatar';

import { List, ListItem } from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';

import Header from './reusable/Header';
import Footer from './reusable/Footer';

import './ConversationIndexPage.css';
import formatLink from './utils/Link';
import PageHeader from './reusable/PageHeader';

class ConversationIndexPage extends Component {
  render() {
    return (
      <div>
        <Header currentUser={ this.props.currentUser } />
        <Paper zDepth={ 1 } className='paperOverride' rounded={ false }>
          <PageHeader title={
            <FormattedMessage
              id='ConversationIndexPage.header'
              defaultMessage='Inbox'
            />
          } />

          <div className='conversationBox'>
            { this.renderInbox() }
          </div>
        </Paper>
        <Footer />
      </div>
    );
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
            <a href={ formatLink('/search', locale) } >
              <RaisedButton
                primary
                label={
                  <FormattedMessage
                    id='ConversationIndexPage.Search'
                    defaultMessage='Search for volunteers'
                  />
                }
                className='conversationButton'
              />
            </a>
          );
        } else if (volunteer) {
          return (
            <a href={ formatLink('/availabilities/new', locale) } >
              <RaisedButton
                primary
                className='conversationButton'
                label={
                  <FormattedMessage
                    id='availabilityCreateNew'
                  />
                }
              />
            </a>
          );
        }
      }();
      return (
        <List >
          <Subheader >
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
    const { conversations } = this.props;

    return _.map(conversations, (conversation) => {
      const { conversee, id, conversee_avatar, is_first_message_unread } = conversation;

      return (
        <ListItem
          onClick={ this.handleClick(id) }
          key={ conversee }
          leftAvatar={ <Avatar src={ conversee_avatar } /> }
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
          Conversation with { conversee }
        </span>
      );
    } else {
      return (
        <span>
          Conversation with { conversee }
        </span>
      );
    }
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
