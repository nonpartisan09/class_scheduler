import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';

import Message from './Message';
import Header from './reusable/Header';
import Footer from './reusable/Footer';
import { determineRecipient } from './utils/messageUtil';

class ConversationPage extends Component {
  componentWillMount(){
    const { } = this.props;
  }

  render() {
    const { currentUser } = this.props;

    return (
      <div>
        <Header currentUser={ currentUser } />
        <Paper zDepth={ 1 } className='paperOverride' rounded={ false }>
          <div className='conversationBox'>
            { this.renderMessages() }
          </div>
        </Paper>
        <Footer />
      </div>
    );
  }

  renderMessages() {
    const {
      currentUser: { url_slug: currentUrlSlug },
      conversation: {
        messages,
        sender_avatar,
      },
      conversation
    } = this.props;

    const newRecipient = determineRecipient({ ...conversation, currentUrlSlug });

    return _.map(messages, ({ body, subject, sent_on }, index) => {
      return (
        <Message
          key={ `${index} + ${sent_on}` }
          newMessageFirstName={ newRecipient.firstName }
          newMessageRecipient={ newRecipient.urlSlug }
          body={ body }
          subject={ subject }
          sentOn={ sent_on }
          avatar={ sender_avatar }
        />
      );
    });
  }
}

ConversationPage.propTypes = {
  conversation: PropTypes.shape({
    sender_avatar: PropTypes.string,
    recipient_avatar: PropTypes.string,
    recipientUrlSlug: PropTypes.string,
    senderUrlSlug: PropTypes.string,
    messages: PropTypes.array
  }),
  currentUser: PropTypes.object
};

ConversationPage.defaultProps = {
  conversation: {
    sender_avatar: '',
    recipient_avatar: '',
    recipientUrlSlug: '',
    senderUrlSlug: '',
    messages: []
  },
  currentUser: { }
};

export default ConversationPage;
