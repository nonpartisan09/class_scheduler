import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import validate from 'react-joi-validation';

import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import SendIcon from 'material-ui/svg-icons/content/send';

import MessageSchema from './schema/MessageSchema';
import Header from './Header';
import FormData from './FormData';
import { postData } from './sendData';
import SnackBarComponent from './reusable/SnackBarComponent';

import './NewMessagePage.css';

const paperMarginOverride = {
  padding: '0',
  maxWidth: '950px',
  margin: '24px auto',
  position: 'relative',
  minHeight: '100px'
};

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
      currentUser,
      errors,
      changeHandler,
      validateHandler
    } = this.props;

    return (
      <div>
        <Header currentUser={ currentUser } />
        <Paper zDepth={ 1 } style={ paperMarginOverride } rounded={ false }>
          <form className='newMessageForm'>
            <TextField
              disabled
              name='recipient'
              value={ userName }
              className='userFormInputField recipient'
              hintText=''
              floatingLabelText='Recipient'
              floatingLabelFixed
            />

            <TextField
              name='subject'
              value={ subject }
              className='userFormInputField subject'
              hintText=''
              floatingLabelText='Subject'
              floatingLabelFixed
              errorText={ errors.subject }
              onChange={ changeHandler('subject') }
              onBlur={ validateHandler('subject') }
            />
            <TextField
              name='body'
              value={ body }
              className='userFormInputField body'
              hintText=''
              floatingLabelText='Body'
              floatingLabelFixed
              errorText={ errors.body }
              onChange={ changeHandler('body') }
              onBlur={ validateHandler('body') }
            />
          </form>

          <FloatingActionButton onClick={ this.handleSubmit } style={ { position: 'absolute', bottom: '-24px', right: '0' } }>
            <SendIcon />
          </FloatingActionButton>

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
            message: 'Success! Your message was sent.'
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
    location.assign('/conversations');
  }

  handleHideSnackBar() {
    this.setState({
      showSnackBar: false
    });
  }

}

NewMessagePage.propTypes = {
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
};

NewMessagePage.defaultProps = {
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
};

const validationOptions = {
  joiSchema: MessageSchema,
  only: 'message',
  allowUnknown: true
};

export default validate(NewMessagePage, validationOptions);
