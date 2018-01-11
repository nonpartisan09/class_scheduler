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
import { FormattedMessage } from 'react-intl';

import { List, ListItem } from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';

import Divider from 'material-ui/Divider';

import Header from './Header';
import './ConversationIndexPage.css';
import Footer from './Footer';

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
        <Paper zDepth={ 1 } className='paperOverride' rounded={ false }>
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
      const { currentUser: { volunteer, client } } = this.props;
      const button = function(){
        if (client) {
          return (
            <a href='/search' >
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
            <a href='/availabilities/new' >
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

    return _.map(conversations, (conversation, index) => {
      const { recipient, sender, recipientUrlSlug } = conversation;
      const { currentUser: { url_slug } } = this.props;
      const conversee = url_slug !== recipientUrlSlug? recipient : sender;

      const title = `Conversation with ${ conversee }`;

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

  renderMessages({ messages, sender_avatar, senderUrlSlug, recipientUrlSlug, sender, recipient }) {
    const { currentUser: { url_slug } } = this.props;
    const newMessageRecipient = url_slug === recipientUrlSlug? senderUrlSlug : recipientUrlSlug;
    const newMessageFirstName = url_slug === recipientUrlSlug? sender : recipient;

    return _.map(messages, ({ body, subject, sent_on }, index ) => {
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
              defaultMessage='Review'
            />
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

  handleReview(urlSlug) {
    return () => {
      location.assign(`/profiles/${urlSlug}`);
    };
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
