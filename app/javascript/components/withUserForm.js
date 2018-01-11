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
import Toggle from 'material-ui/Toggle';
import validate from 'react-joi-validation';

import { FormattedMessage } from 'react-intl';

import ImageInput from './ImageInput';
import DialogComponent from './DialogComponent';
import SnackBarComponent from './reusable/SnackBarComponent';
import Footer from './Footer';

import newUser from './utils/CheckUpdatedFields';
import UserFormConstants from './UserFormConstants';

import './withUserForm.css';

const { SIGN_UP, UPDATE_PROFILE } = UserFormConstants;

const withUserForm = (WrappedComponent, schema, wrappedProps) => {

  class UserForm extends Component {
    constructor(props, context) {
      super(props, context);

      this.handleSubmit = this.handleSubmit.bind(this);
      this.changeHandlerPrograms = this.changeHandlerPrograms.bind(this);
      this.changeHandlerLanguages = this.changeHandlerLanguages.bind(this);
      this.selectionRenderer = this.selectionRenderer.bind(this);
      this.changeTimezoneHandler = this.changeTimezoneHandler.bind(this);
      this.handleImageUpload = this.handleImageUpload.bind(this);
      this.handleShowDialog = this.handleShowDialog.bind(this);
      this.handleShowPassword = this.handleShowPassword.bind(this);
      this.handleShowPrograms = this.handleShowPrograms.bind(this);
      this.handleShowLanguages = this.handleShowLanguages.bind(this);
      this.handleHideSnackBar = this.handleHideSnackBar.bind(this);
      this.handleClearValues = this.handleClearValues.bind(this);
      this.resetForm = this.resetForm.bind(this);

      this.state = {
        message: '',
        showAddressDialog: false,
        showSnackBar: false,
        showPassword: false,
        showPrograms: false,
        showLanguages: false,
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
          timezone,
        },
        currentUser,
        timezones
      } = this.props;

      return (
        <div>
          <WrappedComponent currentUser={ currentUser } />

          <DialogComponent
            title={
              <FormattedMessage
                id='withUserForm.locationDialog'
                defaultMessage='Why do you need my street address and city?'
              />
            }
            onRequestClose={ this.handleShowDialog }
            open={ this.state.showAddressDialog }
            actions={ [ <FlatButton key='close' label='Close' primary onClick={ this.handleShowDialog } /> ] }
            text={ this.renderDialogText() }
          />

          <Paper zDepth={ 1 } className='paperOverride' rounded={ false }>
            <form className='userForm'>
              { this.renderSignUpPrograms() }

              { this.renderSignUpLanguages() }

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

              <div>
                Willing to meet:
              </div>
              { this.renderMeetUpToggle() }

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
                floatingLabelText={
                  <FormattedMessage
                    id='UserForm.aboutMe'
                    defaultMessage='About me (in 280 characters or less)'
                  />
                }
                floatingLabelFixed
                multiLine
                errorText={ errors.description }
                onChange={ changeHandler('description') }
                onBlur={ validateHandler('description') }
              />

              <div>
                { this.renderPasswordFields() }
                { this.renderUpdatePrograms() }
                { this.renderUpdateLanguages() }
              </div>

              { this.renderSignUpCheckBoxes() }
            </form>

            { this.renderSubmit() }
          </Paper>

          { this.renderSnackBar() }
          <Footer />
        </div>
      );
    }

    renderMeetUpToggle() {
      const { city, address } = this.props;

      if (city || address) {
        <Toggle
          label='Face to face / Online'
          disabled={ true }
        />
      } else {
        <Toggle
          label='Exclusively Online'
          disabled={ true }
        />
      }
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
              <FlatButton
                className='userFormProgramButton'
                primary
                label={
                  <FormattedMessage
                    id='UserForm.updatePrograms'
                    defaultMessage='Update my programs'
                  />
                }
                onClick={ this.handleShowPrograms }
              />
            </div>
          );
        }
      }
    }

    renderUpdateLanguages() {
      const { type } = wrappedProps;

      if (type === UPDATE_PROFILE) {
        const { showLanguages } = this.state;

        if (showLanguages) {
          return this.renderLanguages();
        } else {
          return (
            <div className='userFormInnerButton userFormSecondButton'>
              <FlatButton className='userFormLanguageButton' primary label='Update my languages' onClick={ this.handleShowLanguages } />
            </div>
          );
        }
      }
    }

    renderLanguages() {
      const { languages } = this.props;

      if (_.size(languages) > 0) {
        const { errors, validateHandler, currentUser: { languages: userLanguages } } = this.props;

        return (
          <div>
            <SelectField
              floatingLabelFixed
              floatingLabelText='Select One or More Language(s)'
              value={ userLanguages }
              className='userFormInputField languages'
              onChange={ this.changeHandlerLanguages }
              onBlur={ validateHandler('languages') }
              multiple
              errorText={ errors.languages }
              selectionRenderer={ this.selectionRenderer }
            >
              { _.map(languages, ({ name, id }) => {
                return <MenuItem key={ id } insetChildren checked={ _.indexOf(userLanguages, name) > -1 } value={ name } primaryText={ <span> { name } </span> } />;
              })}
            </SelectField>
          </div>
        );
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
              <FlatButton
                className='userFormPasswordButton'
                primary
                label={
                  <FormattedMessage
                    id='UserForm.updatePassword'
                    defaultMessage='Update my password'
                  />
                }
                onClick={ this.handleShowPassword }
              />
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

    handleShowLanguages() {
      this.setState({
        showLanguages: true
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
              <a href={ '/terms_of_use' } className='slidingLink' target='_blank' rel='noreferrer noopener'>
                <FormattedMessage
                  id='UserForm.termsRead'
                  defaultMessage=' Please read tutoría’s terms of use.'
                />
              </a>
            </div>

            <Checkbox
              checked={ terms_and_conditions }
              className='userFormInputField termsAndConditions'
              onCheck={ changeHandler('terms_and_conditions') }
              label={
                <FormattedMessage
                  id='UserForm.termsAccept'
                  defaultMessage='I accept tutoría’s terms of use'
                />
              }
            />

            <Checkbox
              label={
                <FormattedMessage
                  id='UserForm.newsletterOptin'
                  defaultMessage='I would like to be occasionally contacted about tutoría’s updates'
                />
              }
              checked={ contact_permission }
              className='userFormInputField contactPermission'
              onCheck={ changeHandler('contact_permission') }
            />

            <br />
          </div>
        );
      }
    }

    renderSignUpLanguages() {
      const { languages } = this.props;
      const { type } = wrappedProps;

      if (_.size(languages) > 0 && type === SIGN_UP) {
        return this.renderLanguages();
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

    changeHandlerLanguages(event, index, value) {
      const { changeValue } = this.props;
      changeValue('languages', value);
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
            <FormattedMessage
              id='UserForm.helpingWith'
              defaultMessage='I am interested in helping with:'
            />
          </h2>
        );
      } else if (role === 'client' || client ) {
        return (
          <h2 className='userFormHeader'>
            <FormattedMessage
              id='UserForm.helpedWith'
              defaultMessage='I am interested in help with:'
            />
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
            <p>
              <FormattedMessage
                id='UserForm.addressVolunteerDialog1'
                defaultMessage=' Your location will only be used to help clients find volunteers in their area.'
              />
            </p>
            <br />
            <p>
              <FormattedMessage
                id='UserForm.addressVolunteerDialog2'
                defaultMessage='Your street address will not be shown to other users. Only your town/city.'
              />
            </p>
            <p>
              <FormattedMessage
                id='UserForm.addressVolunteerDialog3'
                defaultMessage='This info is not required unless you would like to allow clients to ask for face to face sessions.'
              />
            </p>
          </div>
        );
      } else if (role === 'client' || client) {
        return (
          <div>
            <p>
              <FormattedMessage
                id='UserForm.addressClientDialog1'
                defaultMessage='Your location will only be used to help find volunteers in your area.'
              />
            </p>
            <p>
              <FormattedMessage
                id='UserForm.addressClientDialog2'
                defaultMessage='Your street address will not be shown to other users. Only your town/city.'
              />
            </p>
            <p>
              <FormattedMessage
                id='UserForm.addressClientDialog3'
                defaultMessage='This info is not required unless you would like to use the location feature.'
              />
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
      languages: PropTypes.array,
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
    languages: PropTypes.array,
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
    languages: [],
    programs: [],
    timezones: [],
    currentUser: {
      timezone: '',
      languages: [],
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
