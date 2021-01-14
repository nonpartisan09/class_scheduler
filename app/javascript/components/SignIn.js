import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Joi from 'joi-browser';
import validate from 'react-joi-validation';
import { FormattedMessage } from 'react-intl';

import RaisedButton from '@material-ui/core/RaisedButton';
import FlatButton from '@material-ui/core/FlatButton';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';

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
      any: {
        allowOnly: 'Please enter a valid email.',
      },
    },
  }),
  password: Joi.string().required(),
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
            id="signIn"
            defaultMessage="Sign In"
          />
          ) }
         />
        <form className="signInContainer" onSubmit={ this.handleKeyDown }>
          <TextField
            name="email"
            value={ email }
            className="signInEmailInputField"
            hintText=""
            floatingLabelText="Email"
            floatingLabelFixed
            errorText={ errors.email }
            onChange={ changeHandler('email') }
            onBlur={ validateHandler('email') }
            fullWidth
          />

          <TextField
            name="password"
            value={ password }
            type="password"
            hintText=""
            floatingLabelText="Password"
            floatingLabelFixed
            errorText={ errors.password }
            onChange={ changeHandler('password') }
            onBlur={ validateHandler('password') }
            fullWidth
            className="signInEmailInputField"
          />

          <Checkbox
            checked={ remember_me }
            onCheck={ changeHandler('remember_me') }
            label="Remember me"
          />

          <RaisedButton
            primary
            label={ (
              <FormattedMessage
                id="signIn"
                defaultMessage="Sign In"
              />
            ) }
            onClick={ this.handleSignIn }
            className="signInLink"
          />

          <div className="signInLinkSecondaryContainer">
            <a href={ formatLink('/password/new', locale) } className="signInLinkSecondary">
              <FlatButton
                primary
                label={ (
                  <FormattedMessage
                    id="SignIn.passwordRecovery"
                    defaultMessage="Forgot your password?"
                  />
                ) }
                onClick={ this.handleForgotClick }
              />
            </a>

            <a href={ formatLink('/sign_up/client', locale) } className="signInLinkSecondary">
              <FlatButton
                primary
                label={ (
                  <FormattedMessage
                    id="signUpClient"
                  />
                ) }
              />
            </a>

            <a href={ formatLink('/sign_up/volunteer', locale) } className="signInLinkSecondary">
              <FlatButton
                primary
                label={ (
                  <FormattedMessage
                    id="signUpVolunteer"
                    defaultMessage="Sign up as a volunteer"
                  />
                ) }
              />
            </a>
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
      return <SnackBarComponent open={ this.state.showSnackBar } message={ this.state.message } />;
    }
    return (null);
  }

  handleSignIn() {
    const { errors, locale } = this.props;

    if (_.size(errors) === 0) {
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
