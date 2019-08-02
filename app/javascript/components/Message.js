import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Avatar from 'material-ui/Avatar';
import { FormattedMessage } from 'react-intl';
import Divider from 'material-ui/Divider';
import { Card, CardHeader, CardText } from 'material-ui';
import { postData } from './utils/sendData';
import FormData from './utils/FormData';
import METHODS from './utils/RestConstants';

let styles = {
	wordWrap: 'break-word'
};

class Message extends Component {
	constructor(props) {
		super(props);
		this.state = {
			expanded: false,
			unread: this.props.unread,
			message: ''
		};
	}

	render() {
		const { body } = this.props;
		let unread = this.state.unread;
		const messageContainer = (function() {
			if (unread) {
				return 'messageContainerBold';
			} else {
				return 'messageContainer';
			}
		})();

		return (
			<div onClick={() => this.changeRead()} className={messageContainer}>
				<Card expanded={this.state.expanded} onExpandChange={this.handleExpandChange}>
					<CardHeader showExpandableButton avatar={this.renderAvatar()} title={this.renderSubject()} />
					<CardText expandable style={styles}>
						{body}
					</CardText>
				</Card>
				{this.renderDivider()}
			</div>
		);
	}

	renderAvatar() {
		const { sender_first_name, avatar } = this.props;

		return avatar ? (
			<Avatar className='avatar' src={avatar} />
		) : (
			<Avatar>{sender_first_name[0].charAt(0).toUpperCase()}</Avatar>
		);
	}

	renderDivider() {
		const { sentOn, divider, unread } = this.props;
		let className = this.state.read ? 'messageContainerBold' : '';
		if (divider) {
			return <Divider className={className} key={sentOn} inset />;
		}
	}

	handleReview(urlSlug) {
		return () => {
			location.assign(`/profiles/${urlSlug}`);
		};
	}

	handleExpandChange = (expanded) => {
		this.setState({ expanded: expanded });
	};

	renderSubject() {
		const { subject, sentOn, sender_first_name, unread } = this.props;
		let className = this.state.unread ? 'messageContainerBold' : '';

		if (subject) {
			return (
				<p className={className}>
					<span>{sentOn}</span>
					<br />
					<FormattedMessage id='Message.sentby' defaultMessage='Sent by: ' />
					<span>{sender_first_name}</span>
					<br />
					<FormattedMessage id='Message.subject' defaultMessage='Subject: ' />
					<span>{subject}</span>
				</p>
			);
		} else {
			return '';
		}
	}

	changeRead() {
		this.handleMarkAsRead();
	}

	handleMarkAsRead() {
		const id = this.props.conversation.id;
		const attributes = FormData.from({ id });

		const requestParams = {
			url: '/conversation',
			method: METHODS.PUT,
			attributes,

			successCallBack: ({ unread }) => {
				this.setState({
					unread
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

Message.propTypes = {
	sender_first_name: PropTypes.array,
	sentOn: PropTypes.string,
	avatar: PropTypes.string,
	body: PropTypes.string,
	subject: PropTypes.string,
	unread: PropTypes.bool,
	divider: PropTypes.bool
};

Message.defaultProps = {
	subject: '',
	sender_first_name: '',
	sentOn: '',
	avatar: '',
	body: '',
	unread: false,
	divider: false
};

export default Message;
