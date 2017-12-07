import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import { Link } from 'react-router-dom';

import { List, ListItem } from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';

import Divider from 'material-ui/Divider';

import Header from './Header';
import './ConversationIndexPage.css';

const paperMarginOverride = {
  padding: '0',
  maxWidth: '950px',
  margin: '24px auto',
  minHeight: '150px'
};

const iconButtonElement = (
  <IconButton
    touch
    tooltip='more'
    tooltipPosition='bottom-left'
  >
    <MoreVertIcon />
  </IconButton>
);


class ConversationIndexPage extends Component {
  constructor(props, context) {
    super(props, context);

  }

  render() {
    return (
      <div>
        <Header currentUser={ this.props.currentUser } />
        <Paper zDepth={ 1 } style={ paperMarginOverride } rounded={ false }>
          <div className='conversationBox'>
            { this.renderInbox() }
          </div>
        </Paper>
      </div>
    );
  }

  renderInbox() {
    const { conversations } = this.props;

    if (_.size(conversations) > 0 ) {
      return this.renderConversations();
    } else {
      const { currentUser: { volunteer, client } } = this.props;
      const button = function(){
        if (client) {
          return (
            <a href='/search' >
              <RaisedButton primary label='Search for volunteers' className='conversationButton' />
            </a>
          );
        } else if (volunteer) {
          return (
            <a href='/availabilities/new' >
              <RaisedButton primary label='Create new availabilities' className='conversationButton' />
            </a>
          );
        }
      }();
      return (
        <List >
          <Subheader >
            No Message Available
          </Subheader>
          { button }
        </List>
      );
    }
  }

  renderConversations() {
    const { conversations } = this.props;

    return _.map(conversations, (conversation, index) => {
      const { recipient, sender } = conversation;

      const title = `Conversation with ${ recipient }`;

      return (
        <List key={ index + sender }>
          <Subheader >
            { title }
          </Subheader>

          { this.renderMessages(conversation) }
        </List>
      );
    });
  }

  renderMessages({ messages, sender_avatar, sender_url_slug, recipient_url_slug, sender, recipient }) {
    const { currentUser: { url_slug } } = this.props;
    const newMessageRecipient = url_slug === recipient_url_slug? sender_url_slug : recipient_url_slug;
    const newMessageFirstName = url_slug === recipient_url_slug? sender : recipient;

    return _.map(messages, ({ body, subject, sent_on }, index ) => {
      const rightIconMenu = (
        <IconMenu iconButtonElement={ iconButtonElement } >
          <MenuItem>
            <Link className='conversationIndexPageLink' to={ { pathname: '/messages/new', query: { recipient: newMessageRecipient, userName: newMessageFirstName } } } >
              Reply
            </Link>
          </MenuItem>
        </IconMenu>
      );

      return [
        <ListItem
          key={ sent_on + index }
          leftAvatar={ <Avatar src={ sender_avatar } /> }
          rightIconButton={ rightIconMenu }
          primaryText={ subject }
          secondaryText={
            <p>
              { body }
            </p>
          }
          secondaryTextLines={ 2 }
        />,
        <Divider key={ index + sent_on } inset />
      ];
    });
  }
}

ConversationIndexPage.propTypes = {
  conversations: PropTypes.shape({
    sender_avatar: PropTypes.string,
    recipient_avatar: PropTypes.string
  }),
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
    sender_avatar: '',
    recipient_avatar: ''
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
