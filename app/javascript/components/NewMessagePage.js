import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { FormattedMessage } from 'react-intl';

import validate from 'react-joi-validation';

import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';
import SendIcon from '@material-ui/icons/Send';

import MessageSchema from './schema/MessageSchema';
import FormData from './utils/FormData';
import { postData } from './utils/sendData';
import SnackBarComponent from './reusable/SnackBarComponent';
import PageHeader from './reusable/PageHeader';


class NewMessagePage extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRedirect = this.handleRedirect.bind(this);

    this.state = {
      message: '',
      showSnackBar: false,
    };
  }

  render() {
    const {
      message: {
        subject,
        body,
      },
      location: {
        query: { userName }
      },
      errors,
      changeHandler,
      validateHandler
    } = this.props;

    let disabled = this.props.message.body && this.props.message.subject ? false : true;

    return (
      <div>
        <Paper zDepth={ 1 } className='paperOverride' rounded={ false }>
          <PageHeader title={
            (
              <FormattedMessage
                id='NewMessagePage.header'
                defaultMessage='Send New Message'
              />
            )
            }
          />

          <form className='newMessageForm'>
            <TextField
              disabled
              name='recipient'
              value={ userName }
              className='userFormInputField recipient'
              hintText=''
              label={
                (
                  <FormattedMessage
                    id='NewMessagePage.recipient'
                    defaultMessage='Recipient'
                  />
                )
              }
              
            />

            <TextField
              name='subject'
              value={ subject }
              className='userFormInputField subject'
              hintText={ errors.subject }
              label={
                (
                  <FormattedMessage
                    id='NewMessagePage.subject'
                    defaultMessage='Subject'
                  />
                )
              }              
              error={ _.has(errors, 'subject') }
              onChange={ changeHandler('subject') }
              onBlur={ validateHandler('subject') }
            />
            <TextField
              name='body'
              value={ body }
              className='userFormInputField body'
              hintText={ errors.body }
              label={
                (
                  <FormattedMessage
                    id='NewMessagePage.messageBody'
                    defaultMessage='Body'
                  />
                )
              }              
              error={ _.has(errors, 'body') }
              onChange={ changeHandler('body') }
              onBlur={ validateHandler('body') }
            />
          </form>


          <Fab disabled={ disabled } color="primary" onClick={ this.handleSubmit } style={ { position: 'absolute', bottom: '-24px', right: '0px' } }>
            <SendIcon />
          </Fab>

          { this.renderSnackBar() }
        </Paper>
      </div>
    );
  }

  renderSnackBar() {
    if (this.state.showSnackBar) {
      return <SnackBarComponent open={ this.state.showSnackBar } message={ this.state.message } />;
    }
  }

  handleSubmit() {
    const { errors } = this.props;

    if(_.size(errors) === 0) {
      const { message: { body, subject }, location: { query: { recipient } } } = this.props;

      const attributes = FormData.from({ body, subject, recipient_id: recipient });

      const requestParams = {
        url: '/messages',
        attributes,
        method: 'POST',
        successCallBack: () => {
          this.setState({
            showSnackBar: true,
            message: <FormattedMessage id='NewMessagePage.messageSent' defaultMessage='Success! Your message was sent.' />
          });

          setTimeout(() => {
            this.handleHideSnackBar();
            this.handleRedirect();
          }, 2000);

        },

        errorCallBack: (message) => {
          this.setState({
            showSnackBar: true,
            message: message
          });
          this.resetForm();

          setTimeout(() => {
            this.handleHideSnackBar();
          }, 2000);
        }
      };

      return postData(requestParams);
    }
  }

  handleRedirect() {
    location.assign(`/${this.props.locale}/inbox`);
  }

  handleHideSnackBar() {
    this.setState({
      showSnackBar: false
    });
  }

}

NewMessagePage.propTypes = {
  errors: PropTypes.object,
  message: PropTypes.shape({
    body: PropTypes.string,
    subject: PropTypes.string,
    recipient: PropTypes.string
  }),
  location: PropTypes.shape({
    query: PropTypes.shape({
      recipient: PropTypes.string,
      userName: PropTypes.string
    })
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
  locale: PropTypes.string,
  changeHandler: PropTypes.func.isRequired,
  validateHandler: PropTypes.func.isRequired
};

NewMessagePage.defaultProps = {
  errors: {},
  message: {
    body: '',
    subject: '',
    recipient: ''
  },
  location: {
    query: {
      recipient: '',
      userName: ''
    }
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
  locale: 'en'
};

const validationOptions = {
  joiSchema: MessageSchema,
  only: 'message',
  allowUnknown: true
};

export default validate(NewMessagePage, validationOptions);
