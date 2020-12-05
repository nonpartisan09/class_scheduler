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
import validate, { useSecondArgument } from 'react-joi-validation';

import { FormattedMessage } from 'react-intl';

import ImageInput from '../ImageInput';
import DialogComponent from '../DialogComponent';
import SnackBarComponent from './SnackBarComponent';
import newUser from '../utils/CheckUpdatedFields';
import UserFormConstants from '../utils/UserFormConstants';
import ReviewAsStars from '../ReviewAsStars';
import { ENGLISH, SPANISH } from '../utils/availableLocales';
import formatLink from '../utils/Link';
import getLocalTimezoneFromMap from '../utils/TimeZoneMapping';

import ErrorField from './ErrorField';
import Countries from './Countries';
import States from './States';

import data from '../../../../build/locales/data.json';

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
      this.changeHowTheyFoundUsHandler = this.changeHowTheyFoundUsHandler.bind(this);
      this.changeLocaleHandler = this.changeLocaleHandler.bind(this);
      this.handleImageUpload = this.handleImageUpload.bind(this);
      this.handleShowDialog = this.handleShowDialog.bind(this);
      this.handleShowPassword = this.handleShowPassword.bind(this);
      this.handleShowPrograms = this.handleShowPrograms.bind(this);
      this.handleShowLanguages = this.handleShowLanguages.bind(this);
      this.handleHideSnackBar = this.handleHideSnackBar.bind(this);
      this.handleClearValues = this.handleClearValues.bind(this);
      this.resetForm = this.resetForm.bind(this);
      this.changeCountryHandler = this.changeCountryHandler.bind(this);
      this.changeStateHandler = this.changeStateHandler.bind(this);
      this.errorLanguageHandler = this.errorLanguageHandler.bind(this);  
      this.updateUserTimezone = this.updateUserTimezone.bind(this);
      this.renderFindTimezoneButton = this.renderFindTimezoneButton.bind(this);

      const { location, changeValues, timezone_map } = this.props;   
      const usersTimezone = getLocalTimezoneFromMap(timezone_map);


      this.state = {
        message: '',
        showAddressDialog: false,
        showSnackBar: false,
        showPassword: false,
        showPrograms: false,
        showLanguages: false,
        user: props.currentUser,
        localTimezone: usersTimezone,
      };
 
      let fieldsToUpdate = [];

      // If the location.state contains a user data, then restore the values to the form
      if(!_.isEmpty(location.state)) {
        fieldsToUpdate.push(
          ['first_name', location.state.currentUser.first_name],
          ['email', location.state.currentUser.email],
        );
                
      }else if(wrappedProps && 'userData' in wrappedProps) {
        //If there is data to show in the form for this user, restore the values to the form
        const { userData } = wrappedProps;
        fieldsToUpdate.push(
            ['first_name', userData.firstName],
            ['email', userData.email],
            ['locale', userData.locale],
        );
      }

      const { type } = wrappedProps;
      if (type === SIGN_UP) {      
        if (typeof usersTimezone !== 'undefined') {
          fieldsToUpdate.push(
            ['timezone', usersTimezone],
          );
        }
      }

      changeValues(fieldsToUpdate);

      this.sortArrayProps(props);
    }


    render() {
      const {
        errors, changeHandler, validateHandler,
        currentUser: {
          first_name,
          last_name,
          email,
          phone_number,
          address,
          city,
          state,
          country,
          thumbnail_image,
          description,
          timezone,
          email_notification
        },
        currentUser,
        timezones,
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

          <Paper zDepth={ 1 } className='paperOverride' rounded={ false }>
            <form className='userForm'>
              { this.renderSignUpPrograms() }

              { this.renderSignUpLanguages() }
              { this.renderAverageRating() }

              { this.renderPreferredLocale() }

              <TextField
                name='email'
                value={ email }
                className='userFormInputField email'
                hintText=''
                floatingLabelText={
                  (
                    <FormattedMessage
                      id='UserForm.email'
                      defaultMessage='Email'
                    />
                  )
                }
                floatingLabelFixed
                errorText={ this.errorLanguageHandler('email') }
                onChange={ changeHandler('email') }
                onBlur={ validateHandler('email') }
              />

              <br />

              <TextField
                name='phone_number'
                value={ phone_number }
                className='userFormInputField phoneNumber'
                hintText=''
                floatingLabelText={
                  (
                    <FormattedMessage
                      id='UserForm.phoneNumber'
                      defaultMessage='Phone Number'
                    />
                  )
                }
                floatingLabelFixed
                errorText={ this.errorLanguageHandler('phone_number') }
                onChange={ changeHandler('phone_number') }
                onBlur={ validateHandler('phone_number') }
              />

              <br />

              <TextField
                name='first_name'
                value={ first_name }
                hintText=''
                className='userFormInputField firstName'
                floatingLabelText={
                  (
                    <FormattedMessage
                      id='UserForm.firstName'
                      defaultMessage='First Name'
                    />
                  )
                }
                floatingLabelFixed
                errorText={ this.errorLanguageHandler('first_name') }
                onChange={ changeHandler('first_name') }
                onBlur={ validateHandler('first_name') }
              />

              <br />

              <TextField
                name='last_name'
                value={ last_name }
                hintText=''
                className='userFormInputField lastName'
                floatingLabelText={
                  (
                    <FormattedMessage
                      id='UserForm.lastName'
                      defaultMessage='Last Name'
                    />
                  )
                }
                floatingLabelFixed
                errorText={ this.errorLanguageHandler('last_name') }
                onChange={ changeHandler('last_name') }
                onBlur={ validateHandler('last_name') }
              />

              <br />

              <div className='userFormImage'>
                <ImageInput
                  icon={ <PhotoIcon /> }
                  value={ thumbnail_image }

                  onLoad={ this.handleImageUpload }
                />
              </div>

              { this.renderMeetUpToggle() }

              <Badge
                badgeContent={ 
                  (
                    <span role="button" onClick={ this.handleShowDialog } onKeyPress={ this.handleShowDialog } tabIndex={ 0 }> 
                      <InfoIcon /> 
                    </span> 
                  )
                }
                badgeStyle={ { transform: 'translateY(18px)' } }
                style={ { padding: '0' } }
              >
                <TextField
                  name='address'
                  value={ address }
                  hintText=''
                  className='userFormInputField address'
                  floatingLabelText={
                    (
                      <FormattedMessage
                        id='UserForm.address'
                        defaultMessage='Street Address'
                      />
                    )
                  }
                  floatingLabelFixed
                  multiLine
                  errorText={ this.errorLanguageHandler('address') }
                  onChange={ changeHandler('address') }
                  onBlur={ validateHandler('address') }
                />

                <br />

                <TextField
                  name='city'
                  value={ city }
                  hintText=''
                  className='userFormInputField city'
                  floatingLabelText={
                    (
                      <FormattedMessage
                        id='UserForm.city'
                        defaultMessage='City/Town'
                      />
                    )
                  }
                  floatingLabelFixed
                  errorText={ this.errorLanguageHandler('city') }
                  onChange={ changeHandler('city') }
                  onBlur={ validateHandler('city') }
                />

                {this.renderUserRegion(country, state, validateHandler, errors )}

              </Badge>

              <br />

              <SelectField
                floatingLabelFixed
                floatingLabelText={
                  (
                    <FormattedMessage
                      id='UserForm.timezone'
                      defaultMessage='Select Timezone'
                    />
                  )
                }
                value={ timezone }
                className='userFormInputField timezones'
                errorText={ this.errorLanguageHandler('timezone') }
                onChange={ this.changeTimezoneHandler }
                onBlur={ validateHandler('timezone') }
              >
                { _.map(timezones, name => 
                  (
                    <MenuItem 
                      key={ name } 
                      insetChildren 
                      checked={ timezone === name } 
                      value={ name } 
                      primaryText={ (
                        <span>
                          { name }
                        </span> 
                      ) } 
                    />
                  ) 
                ) }
              </SelectField>
           
              { this. renderFindTimezoneButton() }
              <br />

              { this.renderHowTheyFoundUs() }

              <TextField
                name='description'
                value={ description }
                hintText=''
                className='userFormInputField description'
                floatingLabelText={
                  (
                    <FormattedMessage
                      id='UserForm.aboutMe'
                      defaultMessage='About me (in 280 characters or less)'
                    />
                  )
                }
                floatingLabelFixed
                multiLine
                errorText={ this.errorLanguageHandler('description') }
                onChange={ changeHandler('description') }
                onBlur={ validateHandler('description') }
              />

              <Checkbox
                label={
                  (
                    <FormattedMessage
                      id='UserForm.emailNotification'
                      defaultMessage='I would like to receive an email when I get a new message'
                    />
                  )
                }
                checked={ email_notification }
                className='userFormInputField emailNotification'
                onCheck={ changeHandler('email_notification', { validate: true, strategy: useSecondArgument }) }
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
        </div>
      );
    }

    renderUserRegion(country, state, validateHandler, errors) {
      if (!country || country === 'United States') {
        const countries = Countries.map(c => c.countryName);

        return (
          <section className="userFormInputFieldLocationContainer">

            <SelectField

              floatingLabelFixed
              floatingLabelText={
                (
                  <FormattedMessage
                    id='UserForm.country'
                    defaultMessage='Select Country'
                  />
                )
              }
              value={ country ? country : 'United States' }
              className='userFormInputField country'
              errorText={ this.errorLanguageHandler('country') }
              onChange={ this.changeCountryHandler }
              onBlur={ validateHandler('country') }
            >
              {_.map(countries, name => <MenuItem key={ name } insetChildren checked={ country === name } value={ name } primaryText={ <span> { name } </span> } />) }
            </SelectField>


            <SelectField

              floatingLabelFixed
              floatingLabelText={
                (
                  <FormattedMessage
                    id='UserForm.state'
                    defaultMessage='Select State/Region'
                  />
                )
              }
              value={ state }
              className='userFormInputField state'
              errorText={ this.errorLanguageHandler('state') }
              onChange={ this.changeStateHandler }
              onBlur={ validateHandler('state') }
          >
              { _.map(States, s => <MenuItem key={ s.abbreviation } insetChildren checked={ state === s.abbreviation } value={ s.abbreviation } primaryText={ <span>{ s.abbreviation }</span> } secondaryText={ <span>{ s.name } </span> } />) }
            </SelectField>

          </section>
          
        );
      } else {
        const countries = Countries.map(c => c.countryName);
        const coun = Countries.find(c => c.countryName === country);
        const regions = coun.regions.map(region => region.name );

        return (
          <section className="userFormInputFieldLocationContainer">
            
            <SelectField
              style={{ 'min-width': 250 + 'px' } }
              floatingLabelFixed
              floatingLabelText={
                (
                  <FormattedMessage
                    id='UserForm.country'
                    defaultMessage='Select Country'
                  />
                )
              }
              value={ country ? country : 'United States' }
              className='userFormInputField country'
              errorText={ this.errorLanguageHandler('country') }
              onChange={ this.changeCountryHandler }
              onBlur={ validateHandler('country') }
            >
              {_.map(countries, name => <MenuItem key={ name } insetChildren checked={ country === name } value={ name } primaryText={ <span> { name } </span> } />)}
            </SelectField>

            <SelectField
              style={{ 'min-width': 250 + 'px' } }
              floatingLabelFixed
              floatingLabelText={
                (
                  <FormattedMessage
                    id='UserForm.state'
                    defaultMessage='Select State/Region'
                  />
                )
              }
              value={ state }
              className='userFormInputField state'
              errorText={ this.errorLanguageHandler('state') }
              onChange={ this.changeStateHandler }
              onBlur={ validateHandler('state') }
            >
              {_.map(regions, region => <MenuItem key={ region } insetChildren checked={ state === region } value={ region } primaryText={ <span> { region } </span> } />) }
            </SelectField>
          </section>
          
        );
      }  
    }

    renderMeetUpToggle() {
      const { currentUser: { city, address, state } } = this.props;

      if (city || address || state) {
        return (
          <div className='userFormToggle'>
            <FormattedMessage
              id='UserForm.meetToggle'
              defaultMessage='Willing to meet'
            />
            :
            <Toggle
              label={
                (
                  <FormattedMessage
                    id='UserForm.meetingModeOne'
                    defaultMessage='Face to face & Online'
                  />
                )
              }
              disabled
              style={ { color: 'green' } }
            />
          </div>
        );
      } else {
        return (
          <div className='userFormToggle'>
            <FormattedMessage
              id='UserForm.meetToggle'
            />
            <Toggle
              label={
              (
                <FormattedMessage
                  id='UserForm.meetingModeTwo'
                  defaultMessage='Exclusively Online'
                />
              )
            }
              disabled
            />
          </div>
        );
      }
    }

    renderSubmit() {
      const { currentUser, errors } = this.props;
      const { user } = this.state;

      const updatedUser = newUser(currentUser, user);

      if (_.size(updatedUser) > 0 && _.size(errors) === 0) {
        const {  validateAllHandler } = this.props;

        return (
          <div className='userFormOuterButton'>
            <RaisedButton
              className='userFormSaveButton'
              label={ wrappedProps.primaryButtonLabel }
              onClick={ validateAllHandler(this.handleSubmit) }
              primary
            />
          </div>
        );
      } else {
        return (
          <div className='userFormOuterButton'>
            <RaisedButton
              className='userFormSaveButton'
              label={ wrappedProps.primaryButtonLabel }
              primary
              disabled
              disabledBackgroundColor="#D3D4D7"
            />
          </div>
        );
      }
    }


    renderFindTimezoneButton() {
      const { type } = wrappedProps;
      const { localTimezone } = this.state;

      if(type === UPDATE_PROFILE && typeof localTimezone !== 'undefined') {
        return (
          <>
            <br />
            <RaisedButton
              label={ <FormattedMessage id='Profile.findTimezone' defaultMessage='Find my timezone' /> }
              primary
              onClick={ this.updateUserTimezone }
            />          
          </>
        );
      }
    }

    updateUserTimezone() {
      const { localTimezone } = this.state;
      const { changeValue } = this.props;
      if (typeof localTimezone !== 'undefined') {
        changeValue('timezone', localTimezone);
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

    renderAverageRating() {
      const { type } = wrappedProps;

      if (type === UPDATE_PROFILE) {
       const { currentUser: { average_rating, rating_count } } = this.props;

       if (rating_count > 0) {
         return (
           <div className='userFormAverageRating'>
             <div className='userFormAverageRatingLabel'>
               <FormattedMessage
                 id='UserForm.averageRating'
                 defaultMessage='Average Rating'
               />
             </div>
             <ReviewAsStars averageRating={ average_rating } ratingCount={ rating_count } />
           </div>
         );
       }
      }
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
                  (
                    <FormattedMessage
                      id='UserForm.updatePrograms'
                      defaultMessage='Update my programs'
                    />
                  )
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
              <FlatButton
                className='userFormLanguageButton'
                primary
                label={
                  (
                    <FormattedMessage
                      id='UserForm.myLanguages'
                      defaultMessage='Update My Languages'
                    />
                  )
                }
                onClick={ this.handleShowLanguages }
              />
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
              floatingLabelText={
                (
                  <FormattedMessage
                    id='UserForm.languages'
                    defaultMessage='Language(s) I can speak'
                  />
                )
              }
              value={ userLanguages }
              className='userFormInputField languages'
              onChange={ this.changeHandlerLanguages }
              onBlur={ validateHandler('languages') }
              multiple
              errorText={ this.errorLanguageHandler('languages') }
              selectionRenderer={ this.selectionRenderer }
            >
              { _.map(languages, ({ name, id }) => {
                return (
                  <MenuItem 
                    key={ id } 
                    insetChildren 
                    checked={ _.indexOf(userLanguages, name) > -1 } 
                    value={ name } 
                    primaryText={ (
                      <span>
                        { name } 
                      </span> 
                    ) } 
                  />
                );
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
                floatingLabelText={
                  (
                    <FormattedMessage
                      id='UserForm.currentPassword'
                      defaultMessage='Current Password'
                    />
                  )
                }
                floatingLabelFixed
                errorText={ this.errorLanguageHandler('password') }
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
                floatingLabelText={
                  (
                    <FormattedMessage
                      id='UserForm.newPassword'
                      defaultMessage='New Password'
                    />
                  )
                }
                floatingLabelFixed
                errorText={ this.errorLanguageHandler('password') }
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
                floatingLabelText={
                  (
                    <FormattedMessage
                      id='UserForm.newPasswordConfirmation'
                      defaultMessage='New Password Confirmation'
                    />
                  )
                }
                floatingLabelFixed
                errorText={ this.errorLanguageHandler('password_confirmation') }
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
                  (
                    <FormattedMessage
                      id='UserForm.updatePassword'
                      defaultMessage='Update my password'
                    />
                  )
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
              floatingLabelText={
                (
                  <FormattedMessage
                    id='UserForm.password'
                    defaultMessage='Password'
                  />
                )
              }
              floatingLabelFixed
              errorText={ this.errorLanguageHandler('password') }
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
              floatingLabelText={
                (
                  <FormattedMessage
                    id='UserForm.passwordConfirmation'
                    defaultMessage='Password Confirmation'
                  />
                )
              }
              floatingLabelFixed
              errorText={ this.errorLanguageHandler('password_confirmation') }
              onChange={ changeHandler('password_confirmation') }
              onBlur={ validateHandler('password_confirmation') }
            />
          </div>
        );
      }
    }

    renderHowTheyFoundUs() {
      const { type } = wrappedProps;

      if (type !== SIGN_UP)
        return;

      const {
        validateHandler,
        errors,
        currentUser: {
          how_they_found_us
        },
        how_they_found_us_options
      } = this.props;

      let how_they_found_us_options_english = [...how_they_found_us_options].sort((a, b) => (a.name > b.name) ? 1 : -1);
      let otherIndex = _.findIndex(how_they_found_us_options_english, {name: 'Other'});
      how_they_found_us_options_english.push(how_they_found_us_options_english.splice(otherIndex, 1)[0]);

      let how_they_found_us_options_spanish = [...how_they_found_us_options].sort((a, b) => (a.spanish_name > b.spanish_name) ? 1 : -1);
      otherIndex = _.findIndex(how_they_found_us_options_spanish, {spanish_name: 'Otro'});
      how_they_found_us_options_spanish.push(how_they_found_us_options_spanish.splice(otherIndex, 1)[0]);


      return (
        <div>
          <SelectField
            floatingLabelFixed
            floatingLabelText={
              (
                <FormattedMessage
                  id='UserForm.howTheyFoundUs'
                  defaultMessage='How did you find out about us?'
                />
              )
            }
            value={ how_they_found_us }
            className='userFormInputField howTheyFoundUs'
            errorText={ this.errorLanguageHandler('how_they_found_us') }
            onChange={ this.changeHowTheyFoundUsHandler }
            onBlur={ validateHandler('how_they_found_us') }
          >
            {
              this.props.match.params[0] === ENGLISH ? _.map(how_they_found_us_options_english, ({ name, id }, index) =>
                  (
                    <MenuItem 
                      key={ name + id + index }
                      insetChildren
                      checked={ how_they_found_us === name }
                      value={ name }
                      primaryText={ (
                        <span> 
                          { name } 
                        </span> 
                      ) }
                    />
                  )
                ) : _.map(how_they_found_us_options_spanish, ({ name, spanish_name, id }, index) =>
                (
                  <MenuItem 
                    key={ name + id + index }
                    insetChildren
                    checked={ how_they_found_us === name }
                    value={ name }
                    primaryText={ (
                      <span> 
                        { spanish_name } 
                      </span> 
                    ) }
                  />
                )
              )
            }
          </SelectField>

          <br />
        </div>
      );
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
          errors,
          currentUser: {
            terms_and_conditions,
            contact_permission,
            locale
          }
        } = this.props;

        return (
          <div>
            <div className='userFormTermsAndConditionsLink'>
              <a href={ formatLink('/terms_of_use', locale) } className='slidingLink' target='_blank' rel='noreferrer noopener'>
                <FormattedMessage
                  id='UserForm.termsRead'
                  defaultMessage='Please read Tutoría’s terms of use.'
                />
              </a>
            </div>

            <Checkbox
              checked={ terms_and_conditions }
              className='userFormInputField termsAndConditions'
              onCheck={ changeHandler('terms_and_conditions', { validate: true, strategy: useSecondArgument }) }
              label={
                (
                  <FormattedMessage
                    id='UserForm.termsAccept'
                    defaultMessage='I accept tutoría’s terms of use'
                  />
                )
              }
            />

            <ErrorField error={ this.errorLanguageHandler('terms_and_conditions') } />

            <Checkbox
              label={
                (
                  <FormattedMessage
                    id='UserForm.newsletterOptin'
                    defaultMessage='I would like to be occasionally contacted about tutoría’s updates'
                  />
                )
              }
              checked={ contact_permission }
              className='userFormInputField contactPermission'
              onCheck={ changeHandler('contact_permission', { validate: true, strategy: useSecondArgument }) }
            />

            <br />
          </div>
        );
      }
    }

    renderPreferredLocale() {
      const { errors, validateHandler, currentUser: { locale } } = this.props;

      return (
        <div>
          <SelectField
            floatingLabelFixed
            floatingLabelText={
              (
                <FormattedMessage
                  id='UserForm.locale'
                  defaultMessage='Preferred Website & Notification Language'
                />
              )
            }
            value={ locale }
            className='userFormInputField locale'
            errorText={ this.errorLanguageHandler('locale') }
            onChange={ this.changeLocaleHandler }
            onBlur={ validateHandler('locale') }
          >
            <MenuItem key={ ENGLISH } insetChildren checked={ ENGLISH === locale } value={ ENGLISH } primaryText={ <span>English</span> } />
            <MenuItem key={ SPANISH } insetChildren checked={ SPANISH === locale } value={ SPANISH } primaryText={ <span>Español</span> } />
          </SelectField>
        </div>
      );
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
            floatingLabelText={
              (
                <FormattedMessage
                  id='UserForm.programs'
                  defaultMessage='Select program(s)'
                />
              )
            }
            value={ userPrograms }
            className='userFormInputField programs'
            onChange={ this.changeHandlerPrograms }
            onBlur={ validateHandler('programs') }
            multiple
            errorText={ this.errorLanguageHandler('programs') }
            selectionRenderer={ this.selectionRenderer }
          >
            { _.map(programs, ({ name, spanish_name, id }) => {
              let programName = this.props.match.params[0] === ENGLISH ? name : spanish_name;
              return (
                <MenuItem 
                  key={ id } 
                  insetChildren 
                  checked={ _.indexOf(userPrograms, programName) > -1 } 
                  value={ programName } 
                  primaryText={ (
                    <span> 
                      { programName } 
                    </span> 
                  ) } 
                />
              );
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

    changeLocaleHandler(proxy, index, value) {
      const { changeValue } = this.props;

      changeValue('locale', value);
    }

    changeTimezoneHandler(proxy, index, value) {
      const { changeValue } = this.props;

      changeValue('timezone', value);
    }

    changeCountryHandler(proxy, index, value) {
      const { changeValue } = this.props;

      changeValue('country', value);
    }

    changeStateHandler(proxy, index, value) {
      const { changeValue } = this.props;
      changeValue('state', value);
    }

    changeHowTheyFoundUsHandler(proxy, index, value) {
      const { changeValue } = this.props;

      changeValue('how_they_found_us', value);
    }

    errorLanguageHandler(inputName){
      let errorEn = this.props.errors[inputName];
      let key = _.findKey(data.en, el => el == errorEn);
      switch (this.props.currentUser.locale){
        case 'en': return errorEn;
        case 'es':
          if (key) return data.es[key];
          return errorEn;
      }
    }

    renderProgramLabel() {
      const { match: { params: { role } }, currentUser: { client, volunteer } } = this.props;
      if (role === 'volunteer' || volunteer ) {
        return (
          <h2 className='userFormHeader'>
            <FormattedMessage
              id='UserForm.helpingWith'
              defaultMessage='I am interested in helping with'
            />
            :
          </h2>
        );
      } else if (role === 'client' || client ) {
        return (
          <h2 className='userFormHeader'>
            <FormattedMessage
              id='UserForm.helpedWith'
              defaultMessage='I am interested in help with'
            />
            :
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
                defaultMessage='Your street address will not be shown to other users. Only your town/city and country.'
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
                defaultMessage='Your street address will not be shown to other users. Only your town/city and country.'
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

    sortArrayProps(propsObject) {
      Object.values(propsObject).map(item => {
        if (item instanceof Array) { item.sort(); }
      });
    }
  }

  UserForm.propTypes = {
    errors: PropTypes.object,
    currentUser: PropTypes.shape({
      programs: PropTypes.array,
      first_name: PropTypes.string,
      last_name: PropTypes.string,
      address: PropTypes.string,
      city: PropTypes.string,
      state: PropTypes.string,
      country: PropTypes.string,
      email: PropTypes.string,
      phone_number: PropTypes.string,
      languages: PropTypes.array,
      how_they_found_us: PropTypes.string,
      password: PropTypes.string,
      password_confirmation: PropTypes.string,
      contact_permission: PropTypes.bool,
      terms_and_conditions: PropTypes.bool,
      current_password: PropTypes.string,
      thumbnail_image: PropTypes.oneOfType([ PropTypes.string, PropTypes.object ]),
      timezone: PropTypes.string,
      locale: PropTypes.string,
      description: PropTypes.string,
      email_notification: PropTypes.bool,
      average_rating: PropTypes.number,
      rating_count: PropTypes.number,
      client: PropTypes.bool,
      volunteer: PropTypes.bool
    }),

    match: PropTypes.shape({
      params: PropTypes.shape({
        role: PropTypes.string
      })
    }),
    languages: PropTypes.array,
    programs: PropTypes.array,
    timezones: PropTypes.array,
    timezone_map: PropTypes.object,
    how_they_found_us_options: PropTypes.array,
    changeHandler: PropTypes.func.isRequired,
    changeValue: PropTypes.func.isRequired,
    changeValues: PropTypes.func.isRequired,
    validateHandler: PropTypes.func.isRequired,
    clearValidationAndResetValues: PropTypes.func.isRequired,
    validateAllHandler: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
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
    timezone_map: {},
    how_they_found_us_options: [],
    currentUser: {
      locale: 'en',
      timezone: 'Eastern Time (US & Canada)',
      how_they_found_us: '',
      languages: [],
      programs: [],
      email_notification: true,
      address: '',
      city: '',
      state: '',
      country: '',
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
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