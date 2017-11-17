import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import jasonForm from 'jason-form';

import Joi from 'joi-browser';
import validate from 'react-joi-validation';

import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';

import Header from './Header';
import SnackBarComponent from './reusable/SnackBarComponent';
import { postData } from './sendData';

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
    this.handleHideSnackBar = this.handleHideSnackBar.bind(this);

    this.state = {
      showSnackBar: false,
      message: ''
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

          { this.renderSnackBar() }
        </form>
      </div>
    );
  }

  renderSnackBar() {
    if (this.state.showSnackBar) {
      return <SnackBarComponent open={ this.state.showSnackBar } message={ this.state.message } />;
    }
  }
  handleSignIn() {
    const { errors } = this.props;

    if(_.size(errors) === 0) {

      const { currentUser } = this.props;
      const attributes = jasonForm.FormData.from({ user: currentUser });

      const requestParams = {
        url: '/sign_in',
        attributes,
        method: 'POST',
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
      return postData(requestParams);
    }
  }

  handleHideSnackBar() {
    this.setState({
      showSnackBar: false
    });
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
