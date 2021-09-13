import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';

import Badge from '@material-ui/core/Badge';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import PhotoIcon from '@material-ui/icons/Photo';
import InfoIcon from '@material-ui/icons/Info';
import Switch from '@material-ui/core/Switch';
import InputLabel from '@material-ui/core/InputLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';
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

const TextFieldWithStyle = withStyles({
  root: {
    '& .MuiFormHelperText-root': {
      color: 'red !important',
    },
  },
})(TextField);

const FormHelperTextWithStyle = withStyles({
  root: {
    '& .MuiFormHelperText-root': {
      color: 'red !important',
    },
    color: 'red !important'
  },
})(FormHelperText);

const FormControlLabelWithStyle = withStyles({
  root: {
    '& .MuiFormControlLabel-label': {
      color: 'rgb(167, 169, 172) !important',
      fontSize: '14px'
    },
    marginLeft: 'auto !important',
  },
})(FormControlLabel);


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
        languageError: false,
        programError: false
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
            actions={ [<Button key='close' color='primary' onClick={ this.handleShowDialog }>Close</Button>] }
            text={ this.renderDialogText() }
          />

          <Paper elevation={ 1 } className='paperOverride' square>
            <form className='userForm'>
              { this.renderSignUpPrograms() }

              { this.renderSignUpLanguages() }
              { this.renderAverageRating() }

              { this.renderPreferredLocale() }

              <TextFieldWithStyle
                name='email'
                value={ email }
                className='userFormInputField email'                
                label={
                  (
                    <FormattedMessage
                      id='UserForm.email'
                      defaultMessage='Email'
                    />
                  )
                }
                InputLabelProps={ {
                  shrink: true,
                } } 
                helperText={ this.errorLanguageHandler('email') }
                onChange={ changeHandler('email') }
                onBlur={ validateHandler('email') }
              />

              <br />

              <TextFieldWithStyle
                name='phone_number'
                value={ phone_number }
                className='userFormInputField phoneNumber'                
                label={
                  (
                    <FormattedMessage
                      id='UserForm.phoneNumber'
                      defaultMessage='Phone Number'
                    />
                  )
                }
                InputLabelProps={ {
                  shrink: true,
                } } 
                helperText={ this.errorLanguageHandler('phone_number') }
                onChange={ changeHandler('phone_number') }
                onBlur={ validateHandler('phone_number') }
              />

              <br />

              <TextFieldWithStyle
                name='first_name'
                value={ first_name }                
                className='userFormInputField firstName'
                label={
                  (
                    <FormattedMessage
                      id='UserForm.firstName'
                      defaultMessage='First Name'
                    />
                  )
                }    
                InputLabelProps={ {
                  shrink: true,
                } }            
                helperText={ this.errorLanguageHandler('first_name') }
                onChange={ changeHandler('first_name') }
                onBlur={ validateHandler('first_name') }
              />

              <br />

              <TextFieldWithStyle
                name='last_name'
                value={ last_name }                
                className='userFormInputField lastName'
                label={
                  (
                    <FormattedMessage
                      id='UserForm.lastName'
                      defaultMessage='Last Name'
                    />
                  )
                }
                InputLabelProps={ {
                  shrink: true,
                } } 
                helperText={ this.errorLanguageHandler('last_name') }
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
                classes={ { badge: 'userFormBadge' } }
                style={ { padding: '0' } }
              >
                <TextFieldWithStyle
                  name='address'
                  value={ address }                  
                  className='userFormInputField address'
                  label={
                    (
                      <FormattedMessage
                        id='UserForm.address'
                        defaultMessage='Street Address'
                      />
                    )
                  }
                  InputLabelProps={ {
                    shrink: true,
                  } } 
                  multiline
                  helperText={ this.errorLanguageHandler('address') }
                  onChange={ changeHandler('address') }
                  onBlur={ validateHandler('address') }
                />
              </Badge>

              <br />

              <TextFieldWithStyle
                name='city'
                value={ city }                  
                className='userFormInputField city'
                label={
                    (
                      <FormattedMessage
                        id='UserForm.city'
                        defaultMessage='City/Town'
                      />
                    )
                  }
                InputLabelProps={ {
                    shrink: true,
                  } } 
                helperText={ this.errorLanguageHandler('city') }
                onChange={ changeHandler('city') }
                onBlur={ validateHandler('city') }
                />

              {this.renderUserRegion(country, state, validateHandler, errors )}          

              <br />

              <div className='userFormInputField timezones'>
                <InputLabel>
                  <FormattedMessage
                    id='UserForm.timezone'
                    defaultMessage='Select Timezone'
                    />
                </InputLabel>
                <Select                
                  value={ timezone }
                  className='userFormInputField timezones'
                  // helperText={ this.errorLanguageHandler('timezone') }
                  onChange={ this.changeTimezoneHandler }
                  onBlur={ validateHandler('timezone') }
                  renderValue={ (selected) => selected }
                >
                  { _.map(timezones, name => 
                  (
                    <MenuItem 
                      key={ name }  
                      value={ name }  
                    >
                      <Checkbox checked={ timezone === name } />
                      <ListItemText primary={ name } />
                    </MenuItem>
                  ) 
                ) }
                </Select>
                <FormHelperText>{ this.errorLanguageHandler('timezone') }</FormHelperText>
           
                { this. renderFindTimezoneButton() }
              </div>
              <br />

              { this.renderHowTheyFoundUs() }

              <TextFieldWithStyle
                name='description'
                value={ description }                
                className='userFormInputField description'
                label={
                  (
                    <FormattedMessage
                      id='UserForm.aboutMe'
                      defaultMessage='About me (in 280 characters or less)'
                    />
                  )
                }          
                InputLabelProps={ {
                  shrink: true,
                } }       
                multiline
                helperText={ this.errorLanguageHandler('description') }
                onChange={ changeHandler('description') }
                onBlur={ validateHandler('description') }
              />
              <FormControlLabel
                control={ (
                  <Checkbox               
                    checked={ email_notification }
                    name='emailNotification'
                    onChange={ changeHandler('email_notification', { validate: true, strategy: useSecondArgument }) }
                    color='primary'
              />
                ) }
                label={
                (
                  <FormattedMessage
                    id='UserForm.emailNotification'
                    defaultMessage='I would like to receive an email when I get a new message'
                  />
                )
              } />              

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
            <FormControl className='userFormInputField country'>
              <InputLabel>
                <FormattedMessage
                  id='UserForm.country'
                  defaultMessage='Select Country'
                  />
              </InputLabel>
              <Select              
                value={ country ? country : '' }
                className='userFormInputField country'
              // helperText={ this.errorLanguageHandler('country') }
                onChange={ this.changeCountryHandler }
                onBlur={ validateHandler('country') }
                renderValue={ (selected) => selected }
              >
                {_.map(countries, name => (
                  <MenuItem
                    key={ name }
                    value={ name }
                  >
                    <Checkbox checked={ country === name } />
                    <ListItemText primary={ name } />
                  </MenuItem>
              )) }
              </Select>
              <FormHelperText>{ this.errorLanguageHandler('country') }</FormHelperText>
            </FormControl>
            <FormControl className='userFormInputField state'>
              <InputLabel>
                <FormattedMessage
                  id='UserForm.state'
                  defaultMessage='Select State/Region'
                  />
              </InputLabel>
              <Select              
                value={ state }
                className='userFormInputField state'
              // helperText={ this.errorLanguageHandler('state') }
                onChange={ this.changeStateHandler }
                onBlur={ validateHandler('state') }
                renderValue={ (selected) => selected }
              >
                { _.map(States, s => (
                  <MenuItem
                    key={ s.abbreviation }
                    value={ s.abbreviation }
                  > 
                    <Checkbox checked={ state === s.abbreviation } />
                    <ListItemText primary={ s.abbreviation + ' ' + s.name } />
                  </MenuItem>
                  )) }
              </Select>
              <FormHelperText>{ this.errorLanguageHandler('state') }</FormHelperText>
            </FormControl>
          </section>
          
        );
      } else {
        const countries = Countries.map(c => c.countryName);
        const coun = Countries.find(c => c.countryName === country);
        const regions = coun.regions.map(region => region.name );

        return (
          <section className="userFormInputFieldLocationContainer">
            
            <Select
              style={ { 'minWidth': 250 + 'px' } }              
              label={
                (
                  <FormattedMessage
                    id='UserForm.country'
                    defaultMessage='Select Country'
                  />
                )
              }
              value={ country ? country : 'United States' }
              className='userFormInputField country'
              // helperText={ this.errorLanguageHandler('country') }
              onChange={ this.changeCountryHandler }
              onBlur={ validateHandler('country') }
              renderValue={ (selected) => selected }
            >
              {_.map(countries, name => (
                <MenuItem
                  key={ name }
                  value={ name }
                > 
                  <Checkbox checked={ country === name } />
                  <ListItemText primary={ name } /> 
                </MenuItem>
              ))}
            </Select>
            <FormHelperTextWithStyle>{ this.errorLanguageHandler('country') }</FormHelperTextWithStyle>


            <Select
              style={ { 'minWidth': 250 + 'px' } }              
              label={
                (
                  <FormattedMessage
                    id='UserForm.state'
                    defaultMessage='Select State/Region'
                  />
                )
              }
              value={ state }
              className='userFormInputField state'
              // helperText={ this.errorLanguageHandler('state') }
              onChange={ this.changeStateHandler }
              onBlur={ validateHandler('state') }
              renderValue={ (selected) => selected }
            >
              {_.map(regions, region => (
                <MenuItem
                  key={ region }
                  value={ region }
                > 
                  <Checkbox checked={ state === region } />
                  <ListItemText primary={ region } /> 
                </MenuItem>
              )) }
            </Select>
            <FormHelperTextWithStyle>{ this.errorLanguageHandler('state') }</FormHelperTextWithStyle>
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
            <FormControlLabelWithStyle
              control={ <Switch style={ { color: 'green' } } disabled /> }
              label={
                (
                  <FormattedMessage
                    id='UserForm.meetingModeOne'
                    defaultMessage='Face to face & Online'
                  />
                )
              }
              labelPlacement='start'
            />
          </div>
        );
      } else {
        return (
          <div className='userFormToggle'>
            <FormattedMessage
              id='UserForm.meetToggle'
            />
            <FormControlLabelWithStyle
              control={ <Switch disabled /> }
              label={
              (
                <FormattedMessage
                  id='UserForm.meetingModeTwo'
                  defaultMessage='Exclusively Online'
                />
              )
              }
              labelPlacement='start'
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
            <Button
              className='userFormSaveButton'
              variant='contained'
              label={ wrappedProps.primaryButtonLabel }
              onClick={ validateAllHandler(this.handleSubmit) }
              color='primary'
            >
              { wrappedProps.primaryButtonLabel }
            </Button>
          </div>
        );
      } else {
        return (
          <div className='userFormOuterButton'>
            <Button
              className='userFormSaveButton'
              variant='contained'
              label={ wrappedProps.primaryButtonLabel }
              color='primary'
              disabled
            >
              { wrappedProps.primaryButtonLabel }
            </Button>
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
            <Button
              variant='contained'
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
              <Button
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
              <Button
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
      const { languageError} = this.state;
            
      if (_.size(languages) > 0) {
        const { errors, validateHandler, currentUser: { languages: userLanguages } } = this.props;
        
        return (
          <div className='userFormInputField languages'>
            <InputLabel>
              <FormattedMessage
                id='UserForm.languages'
                defaultMessage='Language(s) I can speak'
                />
            </InputLabel>
            <Select
              id='languages'
              value={ userLanguages }
              className='userFormInputField languages'
              onChange={ this.changeHandlerLanguages }
              onBlur={ validateHandler('languages') }
              multiple
              error={ this.errorLanguageHandler('languages') }
              //helperText={ this.errorLanguageHandler('languages') }
              renderValue={ this.selectionRenderer }
            >
              { _.map(languages, ({ name, id }) => {
                return (
                  <MenuItem 
                    key={ id }  
                    value={ name }                     
                  >
                    <Checkbox checked={ _.indexOf(userLanguages, name) > -1  } />
                    <ListItemText primary={ name } />
                  </MenuItem>
                );
              })}
            </Select>
            <FormHelperTextWithStyle>{ this.errorLanguageHandler('languages') }</FormHelperTextWithStyle>
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
              <TextFieldWithStyle
                name='current_password'
                value={ current_password }
                type='password'
                className='userFormInputField current_password'
                
                label={
                  (
                    <FormattedMessage
                      id='UserForm.currentPassword'
                      defaultMessage='Current Password'
                    />
                  )
                }
                
                helperText={ this.errorLanguageHandler('password') }
                onChange={ changeHandler('current_password') }
                onBlur={ validateHandler('current_password') }
              />

              <br />

              <TextFieldWithStyle
                name='password'
                value={ password }
                type='password'
                className='userFormInputField password'
                
                label={
                  (
                    <FormattedMessage
                      id='UserForm.newPassword'
                      defaultMessage='New Password'
                    />
                  )
                }
                
                helperText={ this.errorLanguageHandler('password') }
                onChange={ changeHandler('password') }
                onBlur={ validateHandler('password') }
              />

              <br />

              <TextFieldWithStyle
                name='password_confirmation'
                value={ password_confirmation }
                type='password'
                className='userFormInputField passwordConfirmation'
                
                label={
                  (
                    <FormattedMessage
                      id='UserForm.newPasswordConfirmation'
                      defaultMessage='New Password Confirmation'
                    />
                  )
                }
                
                helperText={ this.errorLanguageHandler('password_confirmation') }
                onChange={ changeHandler('password_confirmation') }
                onBlur={ validateHandler('password_confirmation') }
              />
            </div>
          );
        } else {
          return (
            <div className='userFormInnerButton'>
              <Button
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
            <TextFieldWithStyle
              name='password'
              value={ password }
              type='password'
              className='userFormInputField password'
              
              label={
                (
                  <FormattedMessage
                    id='UserForm.password'
                    defaultMessage='Password'
                  />
                )
              }
              
              helperText={ this.errorLanguageHandler('password') }
              onChange={ changeHandler('password') }
              onBlur={ validateHandler('password') }
            />

            <br />

            <TextFieldWithStyle
              name='password_confirmation'
              value={ password_confirmation }
              type='password'
              className='userFormInputField passwordConfirmation'
              
              label={
                (
                  <FormattedMessage
                    id='UserForm.passwordConfirmation'
                    defaultMessage='Password Confirmation'
                  />
                )
              }
              
              helperText={ this.errorLanguageHandler('password_confirmation') }
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
        <div className='userFormInputField howTheyFoundUs'>
          <InputLabel>
            <FormattedMessage
              id='UserForm.howTheyFoundUs'
              defaultMessage='How did you find out about us?'
                />
          </InputLabel>
          <Select
            name='howTheyFoundUs'
            value={ how_they_found_us }
            className='userFormInputField howTheyFoundUs'
            // helperText={ this.errorLanguageHandler('how_they_found_us') }
            onChange={ this.changeHowTheyFoundUsHandler }
            onBlur={ validateHandler('how_they_found_us') }
            renderValue={ (selected) => selected }
          >
            {
              this.props.match.params[0] === ENGLISH ? _.map(how_they_found_us_options_english, ({ name, id }, index) =>
                  (
                    <MenuItem 
                      key={ name + id + index }
                      value={ name }
                    > 
                      <Checkbox checked={ how_they_found_us === name } />
                      <ListItemText primary={ name } /> 
                    </MenuItem>
                  )
                ) : _.map(how_they_found_us_options_spanish, ({ name, spanish_name, id }, index) =>
                (
                  <MenuItem 
                    key={ name + id + index }
                    value={ name }                    
                  > 
                    <Checkbox checked={ how_they_found_us === name } />
                    <ListItemText primary={ spanish_name } /> 
                  </MenuItem>
                )
              )
            }
          </Select>
          <FormHelperTextWithStyle>{ this.errorLanguageHandler('how_they_found_us') }</FormHelperTextWithStyle>

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
            <FormControlLabel
              control={ (
                <Checkbox
                  checked={ terms_and_conditions }
                  name='termsAndConditions'
                  onChange={ changeHandler('terms_and_conditions', { validate: true, strategy: useSecondArgument }) }   
                  color='primary'           
                />
                ) }
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
            <br />
            <FormControlLabel
              control={ (
                <Checkbox                
                  checked={ contact_permission }
                  name='contactPermission'
                  onChange={ changeHandler('contact_permission', { validate: true, strategy: useSecondArgument }) }
                  color='primary'
                />
                ) }
              label={
                  (
                    <FormattedMessage
                      id='UserForm.newsletterOptin'
                      defaultMessage='I would like to be occasionally contacted about tutoría’s updates'
                    />
                  )
                } 
            />
           
            <br />
          </div>
        );
      }
    }

    renderPreferredLocale() {
      const { errors, validateHandler, currentUser: { locale } } = this.props;

      return (
        <div className='userFormInputField locale'>
          <InputLabel>
            <FormattedMessage
              id='UserForm.locale'
              defaultMessage='Preferred Website & Notification Language'
                />
          </InputLabel>
          <Select

            name='locale'
            value={ locale }
            className='userFormInputField locale'
            // helperText={ this.errorLanguageHandler('locale') }
            onChange={ this.changeLocaleHandler }
            onBlur={ validateHandler('locale') }
            renderValue={ (selected) => selected === 'en' ? 'English' : 'Español' }
          >
            <MenuItem key={ ENGLISH } value={ ENGLISH }>
              <Checkbox checked={ ENGLISH === locale } />
              <ListItemText primary="English" />
            </MenuItem>
            <MenuItem key={ SPANISH } value={ SPANISH }>
              <Checkbox checked={ SPANISH === locale } />
              <ListItemText primary="Español" />
            </MenuItem>
          </Select>
          <FormHelperTextWithStyle>{ this.errorLanguageHandler('locale') }</FormHelperTextWithStyle>
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
      const { validateHandler, errors, programs, currentUser: { programs: userPrograms=[] } } = this.props;
      const { programError } = this.state;
      return (
        <div className='userFormInputField programs'>
          { this.renderProgramLabel() }
          <InputLabel>
            <FormattedMessage
              id='UserForm.programs'
              defaultMessage='Select program(s)'
                />
          </InputLabel>
          <Select
            name='programs'
            value={ userPrograms }
            className='userFormInputField programs'
            onChange={ this.changeHandlerPrograms }
            onBlur={ validateHandler('programs') }
            multiple
            error={ this.errorLanguageHandler('programs') }
            //helperText={ this.errorLanguageHandler('programs') }
            renderValue={ this.selectionRenderer }
          >
            { programs.map( ({ name, spanish_name, id }) => {
              let programName = this.props.match.params[0] === ENGLISH ? name : spanish_name;
              return (
                <MenuItem 
                  key={ id }                     
                  value={ programName } 
                > 
                  <Checkbox checked={ userPrograms.indexOf(programName) > -1 } />
                  <ListItemText primary={ programName } />
                </MenuItem>
              );
            })}
          </Select>
          <FormHelperTextWithStyle>{ this.errorLanguageHandler('programs') }</FormHelperTextWithStyle>
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

    changeHandlerLanguages(event) {
      const { changeValue } = this.props;
      
      changeValue('languages', event.target.value);
    }

    changeHandlerPrograms(event) {
      const { changeValue } = this.props;
      
      changeValue('programs', event.target.value);
    }

    changeLocaleHandler(event) {
      const { changeValue } = this.props;

      changeValue('locale', event.target.value);
    }

    changeTimezoneHandler(event) {
      const { changeValue } = this.props;

      changeValue('timezone', event.target.value);
    }

    changeCountryHandler(event) {
      const { changeValue } = this.props;

      changeValue('country', event.target.value);
    }

    changeStateHandler(event) {
      const { changeValue } = this.props;
      changeValue('state', event.target.value);
    }

    changeHowTheyFoundUsHandler(event) {
      const { changeValue } = this.props;

      changeValue('how_they_found_us', event.target.value);
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
          <>
            <FormattedMessage
              id='UserForm.addressVolunteerDialog1'
              defaultMessage=' Your location will only be used to help clients find volunteers in their area.'
              />
          
            <br />
            <br />

            <FormattedMessage
              id='UserForm.addressVolunteerDialog2'
              defaultMessage='Your street address will not be shown to other users. Only your town/city and country.'
              />

            <br />
            <br />

            <FormattedMessage
              id='UserForm.addressVolunteerDialog3'
              defaultMessage='This info is not required unless you would like to allow clients to ask for face to face sessions.'
              />
          </>
          
        );
      } else if (role === 'client' || client) {
        return (
          <>
            <FormattedMessage
              id='UserForm.addressClientDialog1'
              defaultMessage='Your location will only be used to help find volunteers in your area.'
              />

            <br />
            <br />

            <FormattedMessage
              id='UserForm.addressClientDialog2'
              defaultMessage='Your street address will not be shown to other users. Only your town/city and country.'
              />

            <br />
            <br />

            <FormattedMessage
              id='UserForm.addressClientDialog3'
              defaultMessage='This info is not required unless you would like to use the location feature.'
              />
            
          </>
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
      country: 'United States',
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