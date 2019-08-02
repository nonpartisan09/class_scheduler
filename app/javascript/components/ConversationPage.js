import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';

import Message from './Message';
import Header from './reusable/Header';
import Footer from './reusable/Footer';
import MessageButtons, { MessageTypes } from './reusable/MessageButtons';

class ConversationPage extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			conversation: props.conversation
		};
	}

	render() {
		const { currentUser, conversation: { conversee, conversee_url_slug } } = this.props;

		return (
			<div>
				<Header currentUser={currentUser} />
				<Paper zDepth={1} className='paperOverride' rounded={false}>
					{this.renderReceivedMessages()}
					<br />
					<MessageButtons
						newMessageFirstName={conversee}
						newMessageRecipient={conversee_url_slug}
						locale={currentUser.locale}
						messageType={MessageTypes.REPLY}
					/>
				</Paper>
				<Footer className='footerContainerFixed' />
			</div>
		);
	}

	renderReceivedMessages() {
		const { conversation: { messages } } = this.state;

		return _.map(messages, ({ body, subject, sent_on, sender_first_name, sender_avatar, unread }, index) => {
			return (
				<Message
					key={`${index} + ${sent_on}`}
					sender_first_name={[ sender_first_name ]}
					body={body}
					subject={subject}
					sentOn={sent_on}
					avatar={sender_avatar}
					unread={unread}
					conversation={this.state.conversation}
				/>
			);
		});
	}
}

ConversationPage.propTypes = {
	conversation: PropTypes.shape({
		messages: PropTypes.array,
		is_first_message_unread: PropTypes.bool,
		conversee: PropTypes.any,
		conversee_url_slug: PropTypes.oneOfType([ PropTypes.object, PropTypes.string ])
	}),
	currentUser: PropTypes.object
};

ConversationPage.defaultProps = {
	conversation: {
		sender_avatar: '',
		recipient_avatar: '',
		recipientUrlSlug: '',
		senderUrlSlug: '',
		messages: [],
		conversee: null,
		conversee_url_slug: ''
	},
	currentUser: {}
};

export default ConversationPage;
