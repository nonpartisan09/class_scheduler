import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Joi from 'joi-browser';
import validate from 'react-joi-validation';
import { FormattedMessage } from 'react-intl';

import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';

import FormData from './utils/FormData';
import Header from './reusable/Header';
import SnackBarComponent from './reusable/SnackBarComponent';
import { postData } from './utils/sendData';
import formatLink from './utils/Link';

import './SignIn.css';
import Footer from './reusable/Footer';
import PageHeader from './reusable/PageHeader';

const schema = {
  email: Joi.string().email({ minDomainAtoms: 2 }).required().options({
  language: {
    any: {
      allowOnly: 'Please enter a valid email.'
    }
  }
}),
  password: Joi.string().required(),
  remember_me: Joi.boolean()
};

class SignIn extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleHideSnackBar = this.handleHideSnackBar.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);

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
        remember_me,
        locale
      },
    } = this.props;

    return (
      <div>
        <Header  />
        <PageHeader title={
          <FormattedMessage
            id='signIn'
            defaultMessage='Sign In'
           />
         }
         />
        <form className='signInContainer' onSubmit={ this.handleKeyDown }>
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

          <RaisedButton
            primary
            label={
              <FormattedMessage
                id='signIn'
                defaultMessage='Sign In'
              />
            }
            onClick={ this.handleSignIn }
            className='signInLink'
          />

          <div className='signInLinkSecondaryContainer'>
            <a href={ formatLink('/password/new', locale) } className='signInLinkSecondary'>
              <FlatButton
                primary
                label={
                  <FormattedMessage
                    id='SignIn.passwordRecovery'
                    defaultMessage='Forgot your password?'
                  />
                }
                onClick={ this.handleForgotClick }
              />
            </a>

            <a href={ formatLink('/sign_up/client', locale) } className='signInLinkSecondary'>
              <FlatButton
                primary
                label={
                  <FormattedMessage
                    id='signUpClient'
                  />
                }
              />
            </a>

            <a href={ formatLink('/sign_up/volunteer', locale) } className='signInLinkSecondary'>
              <FlatButton
                primary
                label={
                  <FormattedMessage
                    id='signUpVolunteer'
                    defaultMessage='Sign up as a volunteer'
                  />
                }
              />
            </a>
          </div>

          { this.renderSnackBar() }
        </form>
        <Footer />
      </div>
    );
  }

  handleKeyDown(event) {
    if (event.keycode === 13) {
      this.handleSignIn();
    }
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
      const attributes = FormData.from({ user: currentUser });

      const requestParams = {
        url: '/sign_in',
        attributes,
        method: 'POST',
        successCallBack: ({ currentUser: { locale } }) => {
          location.assign(formatLink('/', locale));
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
