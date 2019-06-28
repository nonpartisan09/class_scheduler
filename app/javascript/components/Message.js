import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Avatar from 'material-ui/Avatar';
import { FormattedMessage } from 'react-intl';
import Divider from 'material-ui/Divider';
import {
  Card,
  CardHeader,
  CardText
} from 'material-ui';

let styles = {
  wordWrap: 'break-word'
};

class Message extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
  }

  render() {
    const { body, unread } = this.props;

    const messageContainer = function() {
      if (unread) {
        return 'messageContainerBold';
      } else {
        return 'messageContainer';
      }
    }();

    return (
      <div className={ messageContainer }>
        <Card expanded={ this.state.expanded } onExpandChange={ this.handleExpandChange }>
          <CardHeader
            showExpandableButton
            avatar={ this.renderAvatar() }
            title={ this.renderSubject() }
          />
          <CardText expandable style={ styles }>
            { body }
          </CardText>
        </Card>
        { this.renderDivider() }
      </div>
    );
  }

  renderAvatar() {
    const { sender_first_name, avatar } = this.props;
    return(
      avatar ?
        <Avatar src={ avatar } />
      : (
        <Avatar>
          { sender_first_name[0].charAt(0).toUpperCase() }
        </Avatar>
        ) );
  }

  renderDivider() {
    const { sentOn, divider } = this.props;

    if (divider) {
      return <Divider key={ sentOn } inset />;
    }
  }

  handleReview(urlSlug) {
    return () => {
      location.assign(`/profiles/${urlSlug}`);
    };
  }

  handleExpandChange = (expanded) => {
    this.setState({ expanded: expanded });
  }

  renderSubject() {
    const {  subject, sentOn, sender_first_name } = this.props;

    if (subject) {
      return (
        <p>
          <span>
            { sentOn }
          </span>
          <br />
          <FormattedMessage
            id='Message.sentby'
            defaultMessage='Sent by: '
          />
          <span>
            { sender_first_name }
          </span>
          <br />
          <FormattedMessage
            id='Message.subject'
            defaultMessage='Subject: '
          />
          <span>
            { subject }
          </span>
        </p>

      );
    } else {
      return '';
    }
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
