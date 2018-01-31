import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import {Tabs, Tab} from 'material-ui/Tabs';
import { FormattedMessage } from 'react-intl';

import Message from './Message';
import Header from './reusable/Header';
import Footer from './reusable/Footer';
import { determineRecipient } from './utils/messageUtil';
import { getData } from './utils/sendData';
import { GET } from './utils/RestConstants';

class ConversationPage extends Component {
  componentWillMount(){
    setTimeout(() => {
      this.handleMarkAsRead();
    }, 2000);
  }

  render() {
    const { currentUser } = this.props;

    return (
      <div>
        <Header currentUser={ currentUser } />
        <Paper zDepth={ 1 } className='paperOverride' rounded={ false }>
          <Tabs>
            <Tab label={
              <FormattedMessage
                id='ConversationPage.receivedMessages'
                defaultMessage='Received'
              />
              } >
              <div>
                <h2>Tab One</h2>
                <p>
                  This is an example tab.
                </p>
                <p>
                  You can put any sort of HTML or react component in here. It even keeps the component state!
                </p>
              </div>
            </Tab>
            <Tab label="Item Two" >
              <div>
                <h2>Tab Two</h2>
                <p>
                  This is another example tab.
                </p>
              </div>
            </Tab>
          </Tabs>
        </Paper>
        <Footer />
      </div>
    );
  }

  renderReceivedMessages() {
    const {
      currentUser: { url_slug: currentUrlSlug },
      conversation: {
        messages,
        sender_avatar,
      },
      conversation
    } = this.props;

    const newRecipient = determineRecipient({ ...conversation, currentUrlSlug });

    return _.map(messages, ({ body, subject, sent_on, unread }, index) => {
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

  handleMarkAsRead() {
    const { conversation: { messages } } = this.props;

    _.filter(messages, 'active');
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
