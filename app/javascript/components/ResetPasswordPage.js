import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Joi from 'joi-browser';
import validate from 'react-joi-validation';
import { FormattedMessage } from 'react-intl';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import Header from './reusable/Header';
import SnackBarComponent from './reusable/SnackBarComponent';
import { getData } from './utils/sendData';

const schema = {
  password: Joi.string().min(8).max(30).required(),
  password_confirmation: Joi.any().valid(Joi.ref('password')).required().options({
    language: {
      any: {
        allowOnly: <FormattedMessage id='passwordNoMatch' defaultMessage='Passwords don’t match' />
      }
    }
  }),
};

class ResetPasswordPage extends Component {
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
    const { errors, changeHandler, validateHandler, currentUser: { password, password_confirmation, } } = this.props;

    return (
      <div>
        <Header  />

        <form className="signInContainer">
          <TextField
            name='password'
            value={ password }
            type='password'
            className='userFormInputField password'
            hintText=''
            floatingLabelText={
              <FormattedMessage
                id='password'
                defaultMessage='Password'
              />
            }
            floatingLabelFixed
            errorText={ errors.password }
            onChange={ changeHandler('password') }
            onBlur={ validateHandler('password') }
          />

          <br />

          <TextField
            name='password_confirmation'
            value={ password_confirmation }
            type='password'
            className='userFormInputField passwordConfirmation'
            hintText=''
            floatingLabelText={
              <FormattedMessage
                id='passwordConfirmation'
                defaultMessage='Password Confirmation'
              />
            }
            floatingLabelFixed
            errorText={ errors.password_confirmation }
            onChange={ changeHandler('password_confirmation') }
            onBlur={ validateHandler('password_confirmation') }
          />

          <br />

          { this.renderSubmitButton() }

          { this.renderSnackBar() }
        </form>
      </div>
    );
  }

  renderSubmitButton() {
    return (
      <RaisedButton
        primary
        label={
          <FormattedMessage
            id='resetPassword'
            defaultMessage='Reset password'
          />
        }
        onClick={ this.handleForgotClick }
        className='signInLink'
      />
    );
  }


  renderSnackBar() {
    if (this.state.showSnackBar) {
      return <SnackBarComponent open={ this.state.showSnackBar } message={ this.state.message } />;
    }
  }

  handleForgotClick() {
    const { errors } = this.props;

    if(_.size(errors) === 0) {

      const { currentUser: { password },  location: { search } } = this.props;

      const searchParams = function(){
        if (search) {
          const searchArray = search.split(/[=&]/);

          if (_.size(searchArray) > 2) {
            return {
              reset_password_token: searchArray[1],
              user_id: _.last(searchArray)
            };
          }
        }
      }();

      const requestParams = {
        url: '/password',
        params: `reset_password_token=${searchParams['reset_password_token']}&password=${password}`,
        method: 'PUT',
        successCallBack: () => {
         location.assign('/');
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
      return getData(requestParams);
    }
  }

  handleHideSnackBar() {
    this.setState({
      showSnackBar: false
    });
  }
}

ResetPasswordPage.propTypes = {
  errors: PropTypes.object,
  currentUser: PropTypes.shape({
    password: PropTypes.string,
    password_confirmation: PropTypes.string,
  }),
  location: PropTypes.shape({
    search: PropTypes.string
  }),
  changeHandler: PropTypes.func.isRequired,
  validateHandler: PropTypes.func.isRequired,
};

ResetPasswordPage.defaultProps = {
  errors: {},
  currentUser: {
    password: '',
    password_confirmation: ''
  },
  location: {
    search: ''
  }
};

ResetPasswordPage.contextTypes = {
  router: PropTypes.object
};

const validationOptions = {
  joiSchema: schema,
  only: 'currentUser'
};

export default validate(ResetPasswordPage, validationOptions);
