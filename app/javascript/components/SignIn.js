import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Joi from 'joi-browser';
import validate from 'react-joi-validation';
import { FormattedMessage } from 'react-intl';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';

import { FormControlLabel } from '@material-ui/core';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormData from './utils/FormData';
import SnackBarComponent from './reusable/SnackBarComponent';
import { postData } from './utils/sendData';
import formatLink from './utils/Link';
import PageHeader from './reusable/PageHeader';

import {
  ENGLISH,
} from './utils/availableLocales';

const schema = {
  email: Joi.string().email().required().options({
    language: {
      string: {
        email: 'Please enter a valid email.',        
      },
      any: {
        required: 'Please enter your email.'
      }
    },
  }),
  password: Joi.string().required().options({
    language: {
      any: {
        required: 'Please enter your password.'
      },
    },
  }),
  remember_me: Joi.boolean(),
};

class SignIn extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleHideSnackBar = this.handleHideSnackBar.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);

    this.state = {
      showSnackBar: false,
      message: '',
    };
  }

  render() {
    const {
      errors, changeHandler, validateHandler,
      currentUser: {
        password,
        email,
        remember_me,
        locale,
      },
    } = this.props;

    return (
      <div>
        <PageHeader title={ (
          <FormattedMessage
            id="SignIn.label"
            defaultMessage="Sign In"
          />
          ) }
         />
        <form className="signInContainer" onSubmit={ this.handleKeyDown }>
          <TextField
            name="email"
            value={ email }
            className="signInEmailInputField"
            label={ (
              <FormattedMessage
                id="SignIn.email"
                defaultMessage="Email"
             />
            ) }
            InputLabelProps={ {
              shrink: true
            } }           
            onChange={ changeHandler('email') }
            onBlur={ validateHandler('email') }
            fullWidth
          />
          {errors.email && (
            <FormHelperText error>
              { errors.email }
            </FormHelperText>
          )}

          <TextField
            name="password"
            value={ password }
            type="password"
            label={ (
              <FormattedMessage
                id="SignIn.password"
                defaultMessage="Password"
             />
            ) }       
            InputLabelProps={ {
              shrink: true
            } }     
            onChange={ changeHandler('password') }
            onBlur={ validateHandler('password') }
            fullWidth
            className="signInEmailInputField"
          />
          {errors.password && (
            <FormHelperText error>
              { errors.password }
            </FormHelperText>
          )}
          <FormControlLabel
            control={ (
              <Checkbox
                checked={ remember_me }
                onChange={ changeHandler('remember_me') }            
              />
            ) }
            label={ (
              <FormattedMessage
                id="SignIn.rememberMe"
                defaultMessage="Remember me"
             />
            ) }
          />
          <div>
            <Button
              variant='contained'
              color="primary"
              onClick={ this.handleSignIn }
              className="signInLink"
            >
              <FormattedMessage
                id="SignIn.label"
                defaultMessage="Sign In"
              />
            </Button>
          </div>
          <div className="signInLinkSecondaryContainer">
            <Button 
              color="primary" 
              className="signInLinkSecondary"
              onClick={ this.handleForgotClick }
              href={ formatLink('/password/new', locale) }
              >
              <FormattedMessage
                id="SignIn.passwordRecovery"
                defaultMessage="Forgot your password?"
                className="signInLinkSecondary"
                />
            </Button>

            <Button 
              color="primary"
              href={ formatLink('/sign_up/client', locale) }
            >
              <FormattedMessage
                id="signUpClient"
                className="signInLinkSecondary"
              />
            </Button>

            
            <Button 
              color="primary"
              href={ formatLink('/sign_up/volunteer', locale) }
              > 
              <FormattedMessage
                id="signUpVolunteer"
                defaultMessage="Sign up as a volunteer"
                className="signInLinkSecondary"
              />
            </Button>
          </div>

          { this.renderSnackBar() }
        </form>
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
      return <SnackBarComponent open={ this.state.showSnackBar } message={ this.state.message } handleClose={ this.handleHideSnackBar } />;
    }
    return (null);
  }

  handleSignIn() {
    const { errors, locale,
      currentUser: {
        password,
        email
      }} = this.props;

    if (_.size(errors) === 0 && password && email) {
      const cUser = this.props.currentUser;
      const attributes = FormData.from({ user: cUser });

      const requestParams = {
        url: `/${locale}/sign_in`,
        attributes,
        method: 'POST',
        successCallBack: ({ currentUser }) => {
          window.location.assign(formatLink('/', currentUser.locale));
        },
        errorCallBack: (msg) => {
          this.setState({
            showSnackBar: true,
            message: msg,
          });

          setTimeout(() => {
            this.handleHideSnackBar();
          }, 2000);
        },
      };
      return postData(requestParams);
    }
    return (null);
  }

  handleHideSnackBar() {
    this.setState({
      showSnackBar: false,
    });
  }
}

SignIn.propTypes = {
  errors: PropTypes.object,
  currentUser: PropTypes.shape({
    email: PropTypes.string,
    password: PropTypes.string,
    remember_me: PropTypes.bool,
    locale: PropTypes.string,
  }),
  changeHandler: PropTypes.func.isRequired,
  validateHandler: PropTypes.func.isRequired,
  locale: PropTypes.string,
};

SignIn.defaultProps = {
  errors: {},
  currentUser: {
    email: '',
    password: '',
    remember_me: false,
  },
  locale: ENGLISH,
};

SignIn.contextTypes = {
  router: PropTypes.object,
};

const validationOptions = {
  joiSchema: schema,
  only: 'currentUser',
};

export default validate(SignIn, validationOptions);
