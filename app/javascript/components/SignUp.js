import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';

import Joi from 'joi-browser';
import validate from 'react-joi-validation';

import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';

import Header from './Header';
import ErrorField from './reusable/ErrorField';

import './SignUp.css';

const schema = {
  role: Joi.string(),
  courses: Joi.array(),

  first_name: Joi.string().required().options({
    language: {
      any: {
        allowOnly: 'Please enter your first name.'
      }
    }
  }),
  email: Joi.string().email({ minDomainAtoms: 2 }).required().options({
    language: {
      any: {
        allowOnly: 'Please enter a valid email.'
      }
    }
  }),
  password: Joi.string().min(8).required(),
  password_confirmation: Joi.any().valid(Joi.ref('password')).required().options({
    language: {
      any: {
        allowOnly: 'Passwords don\'t match'
      }
    }
  }),
  contact_permission: Joi.boolean(),

  terms_and_conditions: Joi.boolean().valid(true).required().options({
    language: {
      any: {
        allowOnly: 'Please agree to our terms and conditions.'
      }
    }
  })
};

class SignUp extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.changeHandlerCourses = this.changeHandlerCourses.bind(this);

    this.state = {
      error: '',
    };
  }

  render() {
    const {
     errors, changeHandler, validateHandler,
      currentUser: {
        first_name,
        password,
        email,
        password_confirmation,
        terms_and_conditions,
        contact_permission
      },
    } = this.props;

    return (
      <div>
        <Header />

        <div className='signUpHeader'>
          Join Tutoria community: Step 1/2
        </div>

        <ErrorField error={ this.state.error } />

        <form className='signUpForm'>
          { this.renderClasses() }

          <TextField
            name='email'
            value={ email }
            className='signUpEmailInputField email'
            hintText=''
            floatingLabelText='Email'
            floatingLabelFixed
            errorText={ errors.email }
            onChange={ changeHandler('email') }
            onBlur={ validateHandler('email') }
            fullWidth
          />

          <br />

          <TextField
            name='first_name'
            value={ first_name }
            hintText=''
            className='signUpEmailInputField firstName'
            floatingLabelText='First Name'
            floatingLabelFixed
            errorText={ errors.first_name }
            onChange={ changeHandler('first_name') }
            onBlur={ validateHandler('first_name') }
            fullWidth
          />

          <br />

          <br />
          <TextField
            name='password'
            value={ password }
            type='password'
            className='signUpEmailInputField password'
            hintText=''
            floatingLabelText='Password'
            floatingLabelFixed
            errorText={ errors.password }
            onChange={ changeHandler('password') }
            onBlur={ validateHandler('password') }
            fullWidth
          />

          <br />

          <TextField
            name='password_confirmation'
            value={ password_confirmation }
            type='password'
            className='signUpEmailInputField passwordConfirmation'
            hintText=''
            floatingLabelText='Password Confirmation'
            floatingLabelFixed
            errorText={ errors.password_confirmation }
            onChange={ changeHandler('password_confirmation') }
            onBlur={ validateHandler('password_confirmation') }
            fullWidth
          />

          <div className='termsAndConditionsLink'>
            <a href={ '/terms_and_conditions' } className='navigationItem' target='_blank' rel='noreferrer noopener'>
              Please read Tutoria’s terms and conditions.
            </a>
          </div>

          <Checkbox
            checked={ terms_and_conditions }
            className='signUpEmailInputField termsAndConditions'
            onCheck={ changeHandler('terms_and_conditions') }
            label='I accept Tutoria’s terms and conditions'

          />

          <Checkbox
            label='I would like to be occasionally contacted about Tutoria’s updates'
            checked={ contact_permission }
            className='signUpEmailInputField contactPermission'
            onCheck={ changeHandler('contact_permission') }
          />

          <br />
        </form>

        <div className='signUpButtonContainer'>
          <RaisedButton label='Next Step (2/2)' onClick={ this.handleSubmit } primary />
        </div>
      </div>
    );
  }
  renderClasses() {
   const { classes } = this.props;

   if(_.size(classes) > 0) {
     const { validateHandler, errors } = this.props;
     const { currentUser: { courses } } = this.props;

     return (
       <div>
         { this.renderClassLabel() }

         <SelectField
           floatingLabelFixed
           floatingLabelText='Select One or More Class'
           value={ courses }
           onChange={ this.changeHandlerCourses }
           onBlur={ validateHandler('courses') }
           multiple
           errorText={ errors.courses }
         >
           { _.map(classes, ({ name, id }) => {
             return <MenuItem key={ id } insetChildren checked={ _.indexOf(courses, name) > -1 } value={ name } primaryText={ <span> { name } </span> }/>;
           })}
         </SelectField>
       </div>
     );
   }
  }

  changeHandlerCourses(event, index, value) {
    const { changeValue } = this.props;

    changeValue('courses', value);
  }

  renderClassLabel() {
    const { match: { params: { role } } } = this.props;

    if (role === 'volunteer') {
      return (
        <div>
          I am interested in teaching:
        </div>
      );
    } else if (role === 'student' ) {
      return (
        <div>
          I am interested in studying:
        </div>
      );
    }
  }

  handleSubmit() {
    const { errors } = this.props;

    if ( !_.some(errors) ) {
      this.handleUserSignUp();
    }
  }

  handleUserSignUp() {
    const { currentUser } = this.props;
    const { match: { params: { role } } } = this.props;

    return fetch(`/sign_up/${role}`, {
      method: 'POST',
      body: JSON.stringify({ user: {...currentUser }}),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-Token': this.getCSRFToken(),
      },
      credentials: 'same-origin'
    }).then(response => {
      if (response.status < 400) {
        return response.json().then(() => {
          let link = '';

          if (role === 'volunteer') {
            link = '/availabilities/new';
          } else if (role === 'student' ) {
            link = '/search/';
          }
          location.assign(link);
        });
      } else if (response.status < 500) {

        response.json().then(({ error: { message }}) => {

          this.setState({
            error: message
          });
        });
      }
    });
  }

  getCSRFToken() {
    return _.find(document.getElementsByTagName('meta'), (meta) => {
      return meta.name === 'csrf-token';
    }).content;
  }
}

SignUp.propTypes = {
  errors: PropTypes.object,
  currentUser: PropTypes.shape({
    courses: PropTypes.array,
    first_name: PropTypes.string,
    email: PropTypes.string,
    password: PropTypes.string,
    password_confirmation: PropTypes.string,
    contact_permission: PropTypes.bool,
    terms_and_conditions: PropTypes.bool
  }),

  match: PropTypes.shape({
    params: PropTypes.shape({
      role: PropTypes.string
    })
  }),

  classes: PropTypes.array,

  changeHandler: PropTypes.func.isRequired,
  changeValue: PropTypes.func.isRequired,
  validateHandler: PropTypes.func.isRequired,
};

SignUp.defaultProps = {
  errors: {},
  match: {
    params: {
      role: ' '
    }
  },
  classes: [],
  currentUser: {
    courses: [],
    first_name: '',
    email: '',
    password: '',
    password_confirmation: '',
    contact_permission: false,
    terms_and_conditions: false,
  },
};

const validationOptions = {
  joiSchema: schema,
  only: 'currentUser'
};

export default validate(SignUp, validationOptions);
