import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Joi from 'joi-browser';
import validate from 'react-joi-validation';

import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

import FormData from './FormData';
import Header from './Header';
import SnackBarComponent from './reusable/SnackBarComponent';
import { postData } from './sendData';

const schema = {
  email: Joi.string().email({ minDomainAtoms: 2 }).required().options({
    language: {
      any: {
        allowOnly: 'Please enter a valid email.'
      }
    }
  })
};

class NewPasswordPage extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleForgotClick = this.handleForgotClick.bind(this);
    this.handleHideSnackBar = this.handleHideSnackBar.bind(this);

    this.state = {
      showSnackBar: false,
      message: ''
    };
  }
  render() {
    const { errors, changeHandler, validateHandler, currentUser: { email } } = this.props;

    return (
      <div>
        <Header  />

        <form className="signInContainer">
          <TextField
            name='email'
            value={ email }
            className='signUpEmailInputField'
            hintText=''
            floatingLabelText='Please enter your email to recover your password'
            floatingLabelFixed
            errorText={ errors.email }
            onChange={ changeHandler('email') }
            onBlur={ validateHandler('email') }
            fullWidth
          />

          { this.renderSubmitButton() }

          <div className='signInLinkSecondaryContainer'>
            <a href={ '/sign_up/client' } className='signInLinkSecondary'>
              <FlatButton primary label='Sign up as a client' />
            </a>

            <a href={ '/sign_up/volunteer' } className='signInLinkSecondary'>
              <FlatButton primary label='Sign up as a volunteer' />
            </a>
          </div>

          { this.renderSnackBar() }
        </form>
      </div>
    );
  }

  renderSubmitButton() {
    return <RaisedButton primary label='Reset password' onClick={ this.handleForgotClick } className='signInLink' />
  }


  renderSnackBar() {
    if (this.state.showSnackBar) {
      return <SnackBarComponent open={ this.state.showSnackBar } message={ this.state.message } />;
    }
  }

  handleForgotClick() {
    const { errors } = this.props;

    if(_.size(errors) === 0) {

      const { currentUser: { email } } = this.props;
      const attributes = FormData.from({ email });

      const requestParams = {
        url: '/password',
        attributes,
        method: 'POST',
        successCallBack: () => {
          this.setState({
            showSnackBar: true,
            message: 'An email has been sent to your email address.'
          });

          setTimeout(() => {
            this.handleHideSnackBar();
          }, 2000);
        },
        errorCallBack: (message) => {
          this.setState({
            showSnackBar: true,
            message: message
          });

          setTimeout(() => {
            this.handleHideSnackBar();
          }, 2000);
        }
      };
      return postData(requestParams);
    }
  }

  handleHideSnackBar() {
    this.setState({
      showSnackBar: false
    });
  }
}

NewPasswordPage.propTypes = {
  errors: PropTypes.object,
  currentUser: PropTypes.shape({
    email: PropTypes.string,
  }),
  changeHandler: PropTypes.func.isRequired,
  validateHandler: PropTypes.func.isRequired,
};

NewPasswordPage.defaultProps = {
  errors: {},
  currentUser: {
    email: '',
  },
};

NewPasswordPage.contextTypes = {
  router: PropTypes.object
};

const validationOptions = {
  joiSchema: schema,
  only: 'currentUser'
};

export default validate(NewPasswordPage, validationOptions);
