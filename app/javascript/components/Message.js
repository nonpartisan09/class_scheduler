import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import { FormattedMessage } from 'react-intl';
import Divider from '@material-ui/core/Divider';
import {
  Card,
  CardHeader,
  CardText
} from '@material-ui/core';
import Linkify from 'linkifyjs/react';
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
      message: '',
    };

    this.setStyle = this.setStyle.bind(this);
  }

  setStyle() {
    if (this.state.unread) {
      return 'messageContainerBold';
    } else {
      return 'messageContainer';
    }
  }

  render() {
    const { body } = this.props;

    const messageContainer = this.setStyle();

    return (

      <div className={ messageContainer }>
        <Card onClick={ () => this.changeRead() } expanded={ this.state.expanded } onExpandChange={ this.handleExpandChange }>
          <CardHeader
            showExpandableButton
            avatar={ this.renderAvatar() }
            title={ this.renderSubject() }
          />
          <CardText expandable style={ styles }>
            <Linkify tagName='div'>{ body }</Linkify> 
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
        <Avatar className='avatar' src={ avatar } />
      : (
        <Avatar>
          { sender_first_name[0].toUpperCase() }
        </Avatar>
        ) );
  }

  renderDivider() {
    const { sentOn, divider } = this.props;

    if (divider) {
      return <Divider className={ this.state.boldStyle } key={ sentOn } inset />;
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
    const { subject, sentOn, sender_first_name } = this.props;
    const boldStyle = this.setStyle();

    if (subject) {
      return (
        <p className={ boldStyle }>
          <span>
            { sentOn }
          </span>
          <br />
          <FormattedMessage
            id='Message.sentby'
            defaultMessage='Sent by: '
          />
          <span className={ boldStyle }>
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

  changeRead() {
    this.handleMarkAsRead();
  }

  handleMarkAsRead() {
    const id = this.props.id;

    const attributes = FormData.from({ id });

    const requestParams = {
      url: '/message',
      method: METHODS.PUT,
      attributes,

      successCallBack: ({ message: { unread } }) => {

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
  sender_first_name: PropTypes.string,
  sentOn: PropTypes.string,
  avatar: PropTypes.string,
  body: PropTypes.string,
  subject: PropTypes.string,
  unread: PropTypes.bool,
  divider: PropTypes.bool,
  id: PropTypes.number,
};

Message.defaultProps = {
  subject: '',
  sender_first_name: '',
  sentOn: '',
  avatar: '',
  body: '',
  unread: false,
  divider: false,
  id: 0,
};

export default Message;
