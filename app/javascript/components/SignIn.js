import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Joi from 'joi-browser';
import validate from 'react-joi-validation';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';

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
      serverError: ''
    }
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
     <form className="signInContainer">
       <div>
         { this.state.serverError }
       </div>

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

       <RaisedButton primary label='Sign In' onClick={ this.handleSignIn }/>
     </form>
    );
  }
  handleSignIn() {
    const { errors } = this.props;

    if(_.size(errors) === 0) {

      const { currentUser } = this.props;

      return fetch('/sign_in', {
        method: 'POST',
        body: JSON.stringify(currentUser),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRF-Token': this.getCSRFToken(),
        },
        credentials: 'same-origin'
      }).then(response => {
        if (response.status < 400) {

          return response.json().then((json)=> {
            const { router } = this.context;
            router.history.push('/');
          });
        } else if (response.status < 500) {

          if (response.status === 401) {

            response.json().then(({ message }) => {
              return this.setState({
                serverError: message
              });
            });
          }
        }
      })
    }
  }

  getCSRFToken() {
    return _.find(document.getElementsByTagName('meta'), (meta) => {
      return meta.name === 'csrf-token'
    }).content
  }
}

SignIn.propTypes = {
  errors: PropTypes.object,
  currentUser: PropTypes.shape({
    email: PropTypes.string,
    password: PropTypes.string,
    remember_me: PropTypes.bool
  })

};

SignIn.defaultProps = {
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
