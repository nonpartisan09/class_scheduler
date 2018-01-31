import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';

import Message from './Message';
import Header from './reusable/Header';
import Footer from './reusable/Footer';
import { postData } from './utils/sendData';
import { PATCH } from './utils/RestConstants';
import FormData from './utils/FormData';

class ConversationPage extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      message: '',
      conversation: props.conversation
    };
  }

  componentWillMount() {
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
          { this.renderReceivedMessages() }
        </Paper>
        <Footer />
      </div>
    );
  }

  renderReceivedMessages() {
    const { currentUser: { locale } } = this.props;

    const { conversation: { messages, conversee, conversee_url_slug } } = this.state;

    return _.map(messages, ({ body, subject, sent_on, sender_first_name, sender_avatar }, index) => {

      return (
        <Message
          key={ `${index} + ${sent_on}` }
          sender_first_name={ sender_first_name }
          newMessageFirstName={ conversee }
          newMessageRecipient={ conversee_url_slug }
          body={ body }
          subject={ subject }
          sentOn={ sent_on }
          avatar={ sender_avatar }
          locale={ locale }
        />
      );
    });
  }

  handleMarkAsRead() {
    const { conversation: { id } } = this.state;
    const attributes = FormData.from({ id });

    const requestParams = {
      url: '/conversation',
      method: PATCH,
      attributes,

      successCallBack: ({ conversation }) => {
        this.setState({
          conversation
        });
      },

      errorCallBack: (message) => {
        this.setState({
          message: message
        });
      }
    };

    return postData(requestParams);
  }
}

ConversationPage.propTypes = {
  conversation: PropTypes.shape({
    messages: PropTypes.array,
    is_first_message_unread: PropTypes.bool
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
