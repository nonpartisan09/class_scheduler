import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Joi from 'joi-browser';
import validate from 'react-joi-validation';

import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';

import Header from './Header';
import ErrorField from './reusable/ErrorField';
import sendData from './sendData';

import './SignIn.css';

const schema = {
  email: Joi.string().email({ minDomainAtoms: 2 }).required().options({
  language: {
    any: {
      allowOnly: 'Please enter a valid email.'
    }
  }
}),
  password: Joi.string().min(8).required(),
  remember_me: Joi.boolean()
};

class SignIn extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleSignIn = this.handleSignIn.bind(this);

    this.state = {
      error: ''
    };
  }
  render() {
    const {
      errors, changeHandler, validateHandler,
      currentUser: {
        password,
        email,
        remember_me
      },
    } = this.props;

    return (
      <div>
        <Header  />

        <form className="signInContainer">
          <ErrorField error={ this.state.error } />

          <TextField
            name='email'
            value={ email }
            className='signUpEmailInputField'
            hintText=''
            floatingLabelText='Email'
            floatingLabelFixed
            errorText={ errors.email }
            onChange={ changeHandler('email') }
            onBlur={ validateHandler('email') }
            fullWidth
          />

          <TextField
            name='password'
            value={ password }
            type='password'
            hintText=''
            floatingLabelText='Password'
            floatingLabelFixed
            errorText={ errors.password }
            onChange={ changeHandler('password') }
            onBlur={ validateHandler('password') }
            fullWidth
          />

          <Checkbox
            checked={ remember_me }
            onCheck={ changeHandler('remember_me') }
            label='Remember me'
          />

          <RaisedButton primary label='Sign In' onClick={ this.handleSignIn } className='signInLink' />
          <a href={ '/sign_up/student' } rel='nofollow' className='signInLinkSecondary'>
            <FlatButton primary label='Become a student' />
          </a>

          <a href={ '/sign_up/volunteer' } rel='nofollow' className='signInLinkSecondary'>
            <FlatButton primary label='Volunteer as a teacher' />
          </a>
        </form>
      </div>
    );
  }
  handleSignIn() {
    const { errors } = this.props;

    if(_.size(errors) === 0) {

      const { currentUser } = this.props;

      const requestParams = {
        url: '/sign_in',
        jsonBody: currentUser,
        method: 'POST',
        successCallBack: () => {
          location.assign('/');
        },
        errorCallBack: (message) => {
          this.setState({
            error: message
          });
        }
      };
      return sendData(requestParams);
    }
  }
}

SignIn.propTypes = {
  errors: PropTypes.object,
  currentUser: PropTypes.shape({
    email: PropTypes.string,
    password: PropTypes.string,
    remember_me: PropTypes.bool
  }),
  changeHandler: PropTypes.func.isRequired,
  validateHandler: PropTypes.func.isRequired,
};

SignIn.defaultProps = {
  errors: {},
  currentUser: {
    email: '',
    password: '',
    remember_me: false
  },
};

SignIn.contextTypes = {
  router: PropTypes.object
};

const validationOptions = {
  joiSchema: schema,
  only: 'currentUser'
};

export default validate(SignIn, validationOptions);
