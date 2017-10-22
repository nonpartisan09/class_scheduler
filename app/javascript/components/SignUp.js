import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';

import Joi from 'joi-browser';
import validate from 'react-joi-validation';

import Badge from 'material-ui/Badge';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import FlatButton from 'material-ui/FlatButton';

import InfoIcon from 'material-ui/svg-icons/action/info';

import sendData from './sendData';
import Header from './Header';
import DialogComponent from './DialogComponent';
import ErrorField from './reusable/ErrorField';

import './SignUp.css';

const schema = {
  role: Joi.string(),
  courses: Joi.array().min(1).options({
    language: {
      array: {
        min: 'Please select at least one class'
      }
    }
  }),

  first_name: Joi.string().required().options({
    language: {
      any: {
        required: 'Please enter your first name',
        empty: 'Please enter your first name',
      }
    }
  }),

  address: Joi.string().allow(''),
  email: Joi.string().email({ minDomainAtoms: 2 }).required().options({
    language: {
      any: {
        required: 'Please enter an email'
      },
      string: {
        email: 'Please enter a valid email',
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
        allowOnly: 'Please agree to our terms and conditions'
      }
    }
  })
};

class SignUp extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.changeHandlerCourses = this.changeHandlerCourses.bind(this);
    this.selectionRenderer = this.selectionRenderer.bind(this);
    this.handleShowDialog = this.handleShowDialog.bind(this);

    this.state = {
      error: '',
      showAddressDialog: false
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
        contact_permission,
        address
      },
    } = this.props;

    return (
      <div>
        <Header />

        <div className='signUpHeader'>
          Join Tutoria community: Step 1/2
        </div>

        <DialogComponent
          title='Why do you need my address?'
          onRequestClose={ this.handleShowDialog }
          open={ this.state.showAddressDialog }
          actions={ [ <FlatButton key='close' label='Close' primary onClick={ this.handleShowDialog } /> ] }
          text={ this.renderDialogText() }
        />

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

          <Badge
            badgeContent={ <span onClick={ this.handleShowDialog }> <InfoIcon /> </span>}
            badgeStyle={ { fontSize: 14, transform: 'translateY(18px)' } }
            style={ { padding: '0' } }
          >
            <TextField
              name='address'
              value={ address }
              hintText=''
              className='signUpEmailInputField address'
              floatingLabelText='Address'
              floatingLabelFixed
              multiLine
              errorText={ errors.address }
              onChange={ changeHandler('address') }
              onBlur={ validateHandler('address') }
              fullWidth
            />
          </Badge>

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
           selectionRenderer={ this.selectionRenderer }
         >
           { _.map(classes, ({ name, id }) => {
             return <MenuItem key={ id } insetChildren checked={ _.indexOf(courses, name) > -1 } value={ name } primaryText={ <span> { name } </span> }/>;
           })}
         </SelectField>
       </div>
     );
   }
  }

  selectionRenderer(values) {
    if (_.size(values) > 1) {
      return values.join(', ');
    } else if (_.size(values) === 1) {
      return values.toString();
    }
  }

  handleShowDialog() {
    const { showAddressDialog } = this.state;

    this.setState({
      showAddressDialog: !showAddressDialog
    });
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

    if ( _.size(errors) === 0) {
      this.handleUserSignUp();
    }
  }

  renderDialogText() {
    const { match: { params: { role } } } = this.props;

    if (role === 'volunteer') {
      return (
        <div>
          Your address will only be used to help students locate teachers in their area.
          <br />
          It’s not required unless you would like to allow students to ask for face to face sessions.
        </div>
      );
    } else if (role === 'student' ) {
      return (
        <div>
          Your address will only be used to help locate teachers in your area.
          <br />
          It’s not required unless you would like to use the location feature.
        </div>
      );
    }
  }

  handleUserSignUp() {
    const { currentUser } = this.props;
    const { match: { params: { role } } } = this.props;

    const requestParams = {
      url: `/sign_up/${role}`,
      jsonBody: { user: {...currentUser }},
      method: 'POST',
      successCallBack: () => {
        let link = '';

        if (role === 'volunteer') {
          link = '/availabilities/new';
        } else if (role === 'student' ) {
          link = '/search/';
        }
        location.assign(link);
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

SignUp.propTypes = {
  errors: PropTypes.object,
  currentUser: PropTypes.shape({
    courses: PropTypes.array,
    first_name: PropTypes.string,
    address: PropTypes.string,
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
  address: '',
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
