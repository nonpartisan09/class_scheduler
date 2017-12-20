import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';

import Badge from 'material-ui/Badge';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import PhotoIcon from 'material-ui/svg-icons/image/photo';

import InfoIcon from 'material-ui/svg-icons/action/info';
import validate from 'react-joi-validation';

import ImageInput from './ImageInput';
import DialogComponent from './DialogComponent';
import SnackBarComponent from './reusable/SnackBarComponent';

import newUser from './utils/CheckUpdatedFields';
import UserFormConstants from './UserFormConstants';

import './withUserForm.css';

const { SIGN_UP, UPDATE_PROFILE } = UserFormConstants;

const paperMarginOverride = {
  padding: '12px 24px 24px 24px',

  maxWidth: '950px',
  margin: '24px auto'
};

const withUserForm = (WrappedComponent, schema, wrappedProps) => {

  class UserForm extends Component {
    constructor(props, context) {
      super(props, context);

      this.handleSubmit = this.handleSubmit.bind(this);
      this.changeHandlerPrograms = this.changeHandlerPrograms.bind(this);
      this.selectionRenderer = this.selectionRenderer.bind(this);
      this.changeTimezoneHandler = this.changeTimezoneHandler.bind(this);
      this.handleImageUpload = this.handleImageUpload.bind(this);
      this.handleShowDialog = this.handleShowDialog.bind(this);
      this.handleShowPassword = this.handleShowPassword.bind(this);
      this.handleShowPrograms = this.handleShowPrograms.bind(this);
      this.handleHideSnackBar = this.handleHideSnackBar.bind(this);
      this.handleClearValues = this.handleClearValues.bind(this);
      this.resetForm = this.resetForm.bind(this);

      this.state = {
        message: '',
        showAddressDialog: false,
        showSnackBar: false,
        showPassword: false,
        showPrograms: false,
        user: props.currentUser
      };
    }

    render() {
      const {
        errors, changeHandler, validateHandler,
        currentUser: {
          first_name,
          email,
          address,
          city,
          thumbnail_image,
          description,
          timezone
        },
        currentUser,
        timezones
      } = this.props;
      return (
        <div>
          <WrappedComponent currentUser={ currentUser } />

          <DialogComponent
            title='Why do you need my street address and city?'
            onRequestClose={ this.handleShowDialog }
            open={ this.state.showAddressDialog }
            actions={ [ <FlatButton key='close' label='Close' primary onClick={ this.handleShowDialog } /> ] }
            text={ this.renderDialogText() }
          />

          <Paper zDepth={ 1 } style={ paperMarginOverride } rounded={ false }>
            <form className='userForm'>
              { this.renderSignUpPrograms() }

              <TextField
                name='email'
                value={ email }
                className='userFormInputField email'
                hintText=''
                floatingLabelText='Email'
                floatingLabelFixed
                errorText={ errors.email }
                onChange={ changeHandler('email') }
                onBlur={ validateHandler('email') }
              />

              <br />

              <TextField
                name='first_name'
                value={ first_name }
                hintText=''
                className='userFormInputField firstName'
                floatingLabelText='First Name'
                floatingLabelFixed
                errorText={ errors.first_name }
                onChange={ changeHandler('first_name') }
                onBlur={ validateHandler('first_name') }
              />

              <br />

              <div className='userFormImage' >
                <ImageInput
                  icon={ <PhotoIcon /> }
                  value={ thumbnail_image }

                  onLoad={ this.handleImageUpload }
                />
              </div>

              <Badge
                badgeContent={ <span onClick={ this.handleShowDialog }> <InfoIcon /> </span> }
                badgeStyle={ { transform: 'translateY(18px)' } }
                style={ { padding: '0' } }
              >
                <TextField
                  name='address'
                  value={ address }
                  hintText=''
                  className='userFormInputField address'
                  floatingLabelText='Street Address'
                  floatingLabelFixed
                  multiLine
                  errorText={ errors.address }
                  onChange={ changeHandler('address') }
                  onBlur={ validateHandler('address') }
                />

                <br />

                <TextField
                  name='city'
                  value={ city }
                  hintText=''
                  className='userFormInputField city'
                  floatingLabelText='City/Town'
                  floatingLabelFixed
                  errorText={ errors.city }
                  onChange={ changeHandler('city') }
                  onBlur={ validateHandler('city') }
                />
              </Badge>

              <br />

              <SelectField
                floatingLabelFixed
                floatingLabelText='Select Timezone'
                value={ timezone }
                className='userFormInputField timezones'
                errorText={ errors.timezone }
                onChange={ this.changeTimezoneHandler }
                onBlur={ validateHandler('timezone') }
              >
                { _.map(timezones, ({ name, id }, index) => <MenuItem key={ name + id + index } insetChildren checked={ timezone === name } value={ name } primaryText={ <span> { name } </span> } />) }
              </SelectField>

              <br />

              <TextField
                name='description'
                value={ description }
                hintText=''
                className='userFormInputField description'
                floatingLabelText='About me (in 280 characters or less)'
                floatingLabelFixed
                multiLine
                errorText={ errors.description }
                onChange={ changeHandler('description') }
                onBlur={ validateHandler('description') }
              />

              <div>
                { this.renderPasswordFields() }
                { this.renderUpdatePrograms() }
              </div>

              { this.renderSignUpCheckBoxes() }
            </form>

            { this.renderSubmit() }
          </Paper>

          { this.renderSnackBar() }
        </div>
      );
    }

    renderSubmit() {
      const { currentUser, errors } = this.props;
      const { user } = this.state;

      const updatedUser = newUser(currentUser, user);

      if (_.size(updatedUser) > 0 && _.size(errors) === 0) {
        return (
          <div className='userFormOuterButton'>
            <RaisedButton className='userFormSaveButton' label={ wrappedProps.primaryButtonLabel } onClick={ this.handleSubmit } primary />
          </div>
        );
      }
    }

    handleImageUpload(image) {
      const { changeValue } = this.props;

      changeValue('thumbnail_image', image);
    }

    renderSnackBar() {
      if (this.state.showSnackBar) {
        return <SnackBarComponent open={ this.state.showSnackBar } message={ this.state.message } />;
      }
    }

    resetForm() {
      const { clearValidationAndResetValues } = this.props;

      clearValidationAndResetValues();
    }

    handleClearValues() {
      const { changeValues } = this.props;

      changeValues([ ['password_confirmation', ''], ['password', ''] ]);
    }

    renderUpdatePrograms() {
      const { type } = wrappedProps;

      if (type === UPDATE_PROFILE) {
        const { showPrograms } = this.state;

        if (showPrograms) {
          return this.renderPrograms();
        } else {
          return (
            <div className='userFormInnerButton userFormSecondButton'>
              <FlatButton className='userFormProgramButton' primary label='Update my programs' onClick={ this.handleShowPrograms } />
            </div>
          );
        }
      }
    }


    renderPasswordFields() {
      const { type } = wrappedProps;

      if (type === UPDATE_PROFILE) {
        const { showPassword } = this.state;

        if (showPassword) {
          const {
            errors, changeHandler, validateHandler,
            currentUser: {
              password,
              password_confirmation,
              current_password
            }
          } = this.props;

          return (
            <div>
              <TextField
                name='current_password'
                value={ current_password }
                type='password'
                className='userFormInputField current_password'
                hintText=''
                floatingLabelText='Current Password'
                floatingLabelFixed
                errorText={ errors.password }
                onChange={ changeHandler('current_password') }
                onBlur={ validateHandler('current_password') }
              />

              <br />

              <TextField
                name='password'
                value={ password }
                type='password'
                className='userFormInputField password'
                hintText=''
                floatingLabelText='Password'
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
                floatingLabelText='Password Confirmation'
                floatingLabelFixed
                errorText={ errors.password_confirmation }
                onChange={ changeHandler('password_confirmation') }
                onBlur={ validateHandler('password_confirmation') }
              />
            </div>
          );
        } else {
          return (
            <div className='userFormInnerButton'>
              <FlatButton className='userFormPasswordButton' primary label='Update my password' onClick={ this.handleShowPassword } />
            </div>
          );
        }
      } else {

        const {
          errors, changeHandler, validateHandler,
          currentUser: {
            password,
            password_confirmation,
          }
        } = this.props;

        return (
          <div>
            <br />
            <TextField
              name='password'
              value={ password }
              type='password'
              className='userFormInputField password'
              hintText=''
              floatingLabelText='Password'
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
              floatingLabelText='Password Confirmation'
              floatingLabelFixed
              errorText={ errors.password_confirmation }
              onChange={ changeHandler('password_confirmation') }
              onBlur={ validateHandler('password_confirmation') }
            />
          </div>
        );
      }
    }

    handleShowPassword() {
      this.setState({
        showPassword: true
      });
    }

    handleShowPrograms() {
      this.setState({
        showPrograms: true
      });
    }

    renderSignUpCheckBoxes() {
      const { type } = wrappedProps;

      if (type === SIGN_UP) {
        const {
          changeHandler,
          currentUser: {
            terms_and_conditions,
            contact_permission,
          }
        } = this.props;

        return (
          <div>
            <div className='userFormTermsAndConditionsLink'>
              <a href={ '/terms_and_conditions' } className='slidingLink' target='_blank' rel='noreferrer noopener'>
                Please read Tutoria’s terms and conditions.
              </a>
            </div>

            <Checkbox
              checked={ terms_and_conditions }
              className='userFormInputField termsAndConditions'
              onCheck={ changeHandler('terms_and_conditions') }
              label='I accept Tutoria’s terms and conditions'
            />

            <Checkbox
              label='I would like to be occasionally contacted about Tutoria’s updates'
              checked={ contact_permission }
              className='userFormInputField contactPermission'
              onCheck={ changeHandler('contact_permission') }
            />

            <br />
          </div>
        );
      }
    }

    renderSignUpPrograms() {
      const { programs } = this.props;
      const { type } = wrappedProps;

      if (_.size(programs) > 0 && type === SIGN_UP) {
        return this.renderPrograms();
      }
    }

    renderPrograms() {
      const { validateHandler, errors, programs, currentUser: { programs: userPrograms } } = this.props;

      return (
        <div>
          { this.renderProgramLabel() }

          <SelectField
            floatingLabelFixed
            floatingLabelText='Select One or More Program'
            value={ userPrograms }
            className='userFormInputField programs'
            onChange={ this.changeHandlerPrograms }
            onBlur={ validateHandler('programs') }
            multiple
            errorText={ errors.programs }
            selectionRenderer={ this.selectionRenderer }
          >
            { _.map(programs, ({ name, id }) => {
              return <MenuItem key={ id } insetChildren checked={ _.indexOf(userPrograms, name) > -1 } value={ name } primaryText={ <span> { name } </span> } />;
            })}
          </SelectField>
        </div>
      );
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

    handleHideSnackBar() {
      this.setState({
        showSnackBar: false
      });
    }

    changeHandlerPrograms(event, index, value) {
      const { changeValue } = this.props;
      changeValue('programs', value);
    }

    changeTimezoneHandler(proxy, index, value) {
      const { changeValue } = this.props;

      changeValue('timezone', value);
    }

    renderProgramLabel() {
      const { match: { params: { role } }, currentUser: { client, volunteer } } = this.props;
      if (role === 'volunteer' || volunteer ) {
        return (
          <h2 className='userFormHeader'>
            I am interested in helping with:
          </h2>
        );
      } else if (role === 'client' || client ) {
        return (
          <h2 className='userFormHeader'>
            I am interested in help with:
          </h2>
        );
      }
    }

    handleSubmit() {
      const { errors } = this.props;

      if ( _.size(errors) === 0) {
        wrappedProps.primaryButtonAction.apply(this);
      }
    }

    renderDialogText() {
      const { match: { params: { role } }, currentUser: { client, volunteer } } = this.props;

      if (role === 'volunteer' || volunteer ) {
        return (
          <div>
            Your location will only be used to help clients find volunteers in their area.
            <br />
            <p>
              Your street address will not be shown to other users. Only your town/city.
            </p>
            <p>
              This info is not required unless you would like to allow clients to ask for face to face sessions.
            </p>
          </div>
        );
      } else if (role === 'client' || client) {
        return (
          <div>
            <p>
              Your location will only be used to help find volunteers in your area.
            </p>
            <p>
              Your street address will not be shown to other users. Only your town/city.
            </p>
            <p>
             This info is not required unless you would like to use the location feature.
            </p>
          </div>
        );
      }
    }
  }

  UserForm.propTypes = {
    errors: PropTypes.object,
    currentUser: PropTypes.shape({
      programs: PropTypes.array,
      first_name: PropTypes.string,
      address: PropTypes.string,
      city: PropTypes.string,
      email: PropTypes.string,
      password: PropTypes.string,
      password_confirmation: PropTypes.string,
      contact_permission: PropTypes.bool,
      terms_and_conditions: PropTypes.bool,
      current_password: PropTypes.string,
      thumbnail_image: PropTypes.oneOfType([ PropTypes.string, PropTypes.object ]),
      timezone: PropTypes.string
    }),

    match: PropTypes.shape({
      params: PropTypes.shape({
        role: PropTypes.string
      })
    }),

    programs: PropTypes.array,
    timezones: PropTypes.array,
    changeHandler: PropTypes.func.isRequired,
    changeValue: PropTypes.func.isRequired,
    changeValues: PropTypes.func.isRequired,
    validateHandler: PropTypes.func.isRequired,
    clearValidationAndResetValues: PropTypes.func.isRequired,
  };

  UserForm.defaultProps = {
    errors: {},
    match: {
      params: {
        role: ' '
      }
    },
    programs: [],
    timezones: [],
    currentUser: {
      timezone: '',
      programs: [],
      address: '',
      city: '',
      first_name: '',
      email: '',
      password: '',
      password_confirmation: '',
      current_password: '',
      thumbnail_image: {},
      contact_permission: false,
      terms_and_conditions: false,
    },
  };

  const validationOptions = {
    joiSchema: schema,
    only: 'currentUser',
    allowUnknown: true
  };

  return validate(UserForm, validationOptions);
};

export default withUserForm;
