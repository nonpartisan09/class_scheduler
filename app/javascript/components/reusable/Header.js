import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  AppBar,
  Toolbar,
  Menu,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Avatar,
} from '@material-ui/core';
import {
  FaFacebookF,
  FaPhone,
  FaEnvelope,
  FaChevronDown,
  FaBars,
  FaLinkedin
} from 'react-icons/fa';

import {
  ENGLISH,
  SPANISH
} from '../utils/availableLocales';
import SliderButton from './withStyles/StyledSliderButton';
import PaypalButton from '../PaypalButton';
import { getData } from '../utils/sendData';
import HomeLink from './HomeLink';
import formatLink from '../utils/Link';
import SnackBarComponent from './SnackBarComponent';
import NonChromeMessage from './NonChromeMessage';
import contactInfo from '../../ContactInfo';
import { gtag_click_conversion, gtag_formsent_conversion, opts } from './tracking';


const menu = {
  LANGUAGE: 'LA',
  SIGN_UP: 'SU',
  PROFILE: 'PR'
};

class Header extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleSignOut = this.handleSignOut.bind(this);
    this.renderHomeButton = this.renderHomeButton.bind(this);
    this.renderRightElements = this.renderRightElements.bind(this);
    this.rendersignedInHeader = this.rendersignedInHeader.bind(this);
    this.handleSetGuestLocale = this.handleSetGuestLocale.bind(this);
    this.renderContactElements = this.renderContactElements.bind(this);
    this.renderSignedOutHeader = this.renderSignedOutHeader.bind(this);
    this.renderMobileElements = this.renderMobileElements.bind(this);
    this.renderLanguageMenu = this.renderLanguageMenu.bind(this);
    this.handleHideSnackBar = this.handleHideSnackBar.bind(this);
    this.handleProfilePicError = this.handleProfilePicError.bind(this);
    this.handleMenuOpen = this.handleMenuOpen.bind(this);
    this.handleMenuClose = this.handleMenuClose.bind(this);

    this.state = {
      showSnackBar: false,
      message: '',
      LAAnchorEl: null,
      SUAnchorEl: null,
      PRAnchorEl: null,
      currentUserLoggedIn: !_.isEmpty(props.currentUser),
      profilePicSrc: this.props.currentUser.thumbnail_image,
    };
  }

  handleProfilePicError() {
    this.setState({ profilePicSrc: '' });
  }

  handleHideSnackBar() {
    this.setState({ showSnackBar: false });
  }

  handleMenuOpen(event, menu) {
    menu+='AnchorEl';
    this.setState({ [menu]: event.currentTarget });
  }

  handleMenuClose(menu) {
    menu+='AnchorEl';
    this.setState({ [menu]: null });
  }

  handleSetGuestLocale({ target }) {
    const value = target.getAttribute('value');
    localStorage.setItem('locale', value);
    const pathname = _.split(window.location.pathname, '/');
    const localePattern = new RegExp(`(${ENGLISH}|${SPANISH})`);
    const currentGuestLocale = pathname[1] || '';
    const isGuestLocaleAsExpected = localePattern.test(currentGuestLocale);
    
    if (isGuestLocaleAsExpected) {
      const newPathname = _.drop(pathname, 2).join('/');
      location.assign(formatLink(`/${newPathname}`, value));
    } else {
      location.assign(formatLink(window.location.pathname, value));
    }
    this.handleMenuClose('LA');
  }

  handleSignOut() {
    const requestParams = {
      url: '/sign_out',
      jsonBody: {},
      method: 'DELETE',
      successCallBack: () => {
        location.assign(formatLink('/'));
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
    return getData(requestParams);
  }

  render() {
    const menuIconSize = 30;

    if (this.props.mobile) {
      return(
        <div className='wholeHeader'>
          <ExpansionPanel className='menuMobile'>
            <ExpansionPanelSummary
              expandIcon={ (
                <FaBars
                  size={ menuIconSize }
                />
              ) }
            >
              { this.renderHomeButton() }
            </ExpansionPanelSummary>
            <ExpansionPanelDetails
              classes={ { root: 'menuMobileExpansionPanelDetails' } }
            >
              { this.renderMobileElements() }
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <SnackBarComponent
            open={ this.state.showSnackBar }
            message={ this.state.message }
            handleClose={ this.handleHideSnackBar }
          />
        </div>
      );
    } else {
      return(
        <div className='wholeHeader'>
          <NonChromeMessage />
          <AppBar
            position='static'
            style={ { backgroundColor: 'white' } }
            classes={ { root: 'menuAppBar' } }
          >
            <Toolbar
              classes={ { root: 'menuAppBarHigher' } }
            >
              { this.renderContactElements() }
              { this.renderSignedInProfile() }
            </Toolbar>
            <Toolbar
              classes={ { root: 'menuAppBarLower' } }
            >
              <span
                classes={ { root: 'menuAppBarLowerLeftElements' } }
              >
                { this.renderHomeButton() }
              </span>
              <span
                classes={ { root: 'menuAppBarLowerRightElements' } }
              >
                { this.renderRightElements() }
              </span>
            </Toolbar>
          </AppBar>
          <SnackBarComponent
            open={ this.state.showSnackBar }
            message={ this.state.message }
            handleClose={ this.handleHideSnackBar }
          />
        </div>
      );
    }
  }

  renderMobileElements() {
    return(
      <div className='mobileElements'>
        { this.renderRightElements() }
        { this.renderContactElements() }
      </div>
    );
  }

  renderHomeButton() {
    const { currentUser: { locale } } = this.props;
    return(
      <HomeLink
        locale={ locale }
        className='headerHomeLink'
      />
    );
  }

  renderRightElements() {
    const { currentUser, currentUser: { locale } } = this.props;

    return (
      <div className='rightElements'>
        <div className='headerVariableButtons'>
          { (
            this.state.currentUserLoggedIn
            ?
            this.rendersignedInHeader()
            :
            this.renderSignedOutHeader()
          ) }
        </div>
        <div className='headerStaticButtons'>
          <SliderButton
            to={ formatLink('/faq', locale) }
          >
            <FormattedMessage
              id='FAQPage'
              defaultMessage='FAQ'
            />
          </SliderButton>
          <SliderButton
            to={ formatLink('/about', locale) }
          >
            <FormattedMessage
              id='aboutPage'
              defaultMessage='About'
            />
          </SliderButton>
          { (this.props.mobile && !_.isEmpty(currentUser)) ? this.renderSignedInProfile() : ''}
          <PaypalButton key='paypal' />
        </div>
      </div>
    );
  }

  renderLanguageMenu() {
    const currentLocale = localStorage.getItem('locale');
    const languageEnglishValue = 'English';
    const languageSpanishValue = 'Español';

    if (this.props.mobile) {
      return(
        <div className='langaugeMenuMobile'>
          <ExpansionPanel
            classes={ { root: 'langaugeMenuMobilePanel', rounded: 'langaugeMenuMobilePanelRounded' } }
          >
            <ExpansionPanelSummary
              expandIcon={ (
                <FaChevronDown />
              ) }
              classes={ { root: 'languageMenuSummary', content: 'languageMenuSummaryContent' } }
            >
              <FormattedMessage
                id='Header.selectLanguage'
                defaultMessage='Select Language'
              />
            </ExpansionPanelSummary>
            <ExpansionPanelDetails
              classes={ { root: 'languageMenuContent' } }
            >
              <SliderButton
                disabled={ currentLocale === ENGLISH }
                value={ ENGLISH }
                onClick={ this.handleSetGuestLocale }
              >
                { languageEnglishValue }
              </SliderButton>
              <SliderButton
                disabled={ currentLocale === SPANISH }
                value={ SPANISH }
                onClick={ this.handleSetGuestLocale }
              >
                { languageSpanishValue }
              </SliderButton>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
      );
    } else {
      return(
        <div className='languageMenu'>
          <SliderButton
            onClick={ (event) => this.handleMenuOpen(event, menu.LANGUAGE) }
          >
            <FormattedMessage
              id='Header.selectLanguage'
              defaultMessage='Select Language'
            />
            <FaChevronDown
              className='languageMenuChevron'
            />
          </SliderButton>
          <Menu
            id="simple-menu"
            keepMounted
            anchorOrigin={ {vertical: 'bottom', horizontal: 'center'} }
            transformOrigin={ {vertical: 'top', horizontal: 'center'} }
            anchorEl={ this.state.LAAnchorEl }
            getContentAnchorEl={ null }
            open={ Boolean(this.state.LAAnchorEl) }
            onClose={ () => this.handleMenuClose('LA') }
          >
            <SliderButton
              disabled={ currentLocale === ENGLISH }
              value={ ENGLISH }
              onClick={ this.handleSetGuestLocale }
            >
              { languageEnglishValue }
            </SliderButton>
            <SliderButton
              disabled={ currentLocale === SPANISH }
              value={ SPANISH }
              onClick={ this.handleSetGuestLocale }
            >
              { languageSpanishValue }
            </SliderButton>
          </Menu>
        </div>
      );
    }
  }

  renderContactElements() {
    const size = 20;
    const { locale } = this.props;

    return(
      <div className='contactElements'>
        <SliderButton
          grey
          href={ 'tel:'+contactInfo.PHONE }
          clickFunction={ () => gtag_click_conversion('tel:'+contactInfo.PHONE, locale === 'en' ? opts.phone_en : opts.phone_es) }
        >
          <FaPhone
            size={ size }
            label={ (
              <FormattedMessage
                id="UserForm.phoneNumber"
                defaultMessage="Phone Number"
              />
            ) }
          />
          { contactInfo.PHONE }
        </SliderButton>
        <SliderButton
          grey
          href={ 'mailto:'+contactInfo.EMAIL }
          clickFunction={ () => gtag_click_conversion('mailto:'+contactInfo.EMAIL, locale === 'en' ? opts.email_en : opts.email_es) }
        >
          <FaEnvelope
            size={ size }
            label={ (
              <FormattedMessage
                id="UserForm.email"
                defaultMessage="Email address"
              />
            ) }
          />
          { contactInfo.EMAIL }
        </SliderButton>
        <SliderButton
          grey
          href={ contactInfo.FACEBOOK }
          target='_blank'
          rel='noopener noreferrer'
          clickFunction={ () => gtag_click_conversion(contactInfo.FACEBOOK, locale === 'en' ? opts.facebook_en : opts.facebook_es) }
        >
          <FaFacebookF
            size={ size }
            label='Facebook'
          />
          Facebook
        </SliderButton>
        <SliderButton
          grey
          href={ contactInfo.LINKEDIN }
          target='_blank'
          rel='noopener noreferrer'
          clickFunction={ () => gtag_click_conversion(contactInfo.LINKEDIN, locale === 'en' ? opts.linkedin_en : opts.linkedin_es) }
        >
          <FaLinkedin
            size={ size }
            label='LinkedIn'
          />
          LinkedIn
        </SliderButton>
      </div>
    );
  }

  renderSignedOutHeader() {
    const { locale } = this.props;

    if (this.props.mobile) {
      return(
        <div className='signedOutMenuMobile'>
          <ExpansionPanel
            classes={ { root: 'signedOutMenuMobilePanel', rounded: 'signedOutMenuMobilePanelRounded' } }
          >
            <ExpansionPanelSummary
              expandIcon={ (
                <FaChevronDown
                  className='signUpMenuChevron'
                />
              ) }
              classes={ { root: 'signedOutMenuSummary', content: 'signedOutMenuSummaryContent' } }
            >
              <FormattedMessage
                id='signUp'
                defaultMessage='Sign Up'
              />
            </ExpansionPanelSummary>
            <ExpansionPanelDetails
              classes={ { root: 'signedOutMenuContent' } }
            >
              <SliderButton
                to={ formatLink('/sign_up/client', locale) }
                clickFunction={ () => gtag_formsent_conversion(locale === 'en' ? opts.signform_en : opts.signform_es) }
              >
                <FormattedMessage
                  id='signUpClient'
                  default='Sign Up As Client'
                />
              </SliderButton>
              <SliderButton
                to={ formatLink('/sign_up/volunteer', locale) }
              >
                <FormattedMessage
                  id='signUpVolunteer'
                  default='Sign Up As Volunteer'
                />
              </SliderButton>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <SliderButton
            to={ formatLink('/sign_in', locale) }
          >
            <FormattedMessage
              id='logIn'
              defaultMessage='Login'
            />
          </SliderButton>
          { this.renderLanguageMenu() }
        </div>
      );
    } else {
      return (
        <div className='signedOutHeader'>
          <SliderButton
            onClick={ (event) => this.handleMenuOpen(event, menu.SIGN_UP) }
          >
            <FormattedMessage
              id='signUp'
              defaultMessage='Sign Up'
            />
            <FaChevronDown
              className='signUpChevron'
            />
          </SliderButton>
          <Menu
            className='signUpMenu'
            keepMounted
            anchorEl={ this.state.SUAnchorEl }
            getContentAnchorEl={ null }
            anchorOrigin={ {vertical: 'bottom', horizontal: 'center'} }
            transformOrigin={ {vertical: 'top', horizontal: 'center'} }
            open={ Boolean(this.state.SUAnchorEl) }
            onClose={ () => this.handleMenuClose('SU') }
          >
            <SliderButton
              to={ formatLink('/sign_up/client', locale) }
              onClick={ () => {
                this.handleMenuClose('SU'); 
                gtag_formsent_conversion(locale === 'en' ? opts.signform_en : opts.signform_es);} 
              }
            >
              <FormattedMessage
                id='signUpClient'
                default='Sign Up As Client'
              />
            </SliderButton>
            <SliderButton
              to={ formatLink('/sign_up/volunteer', locale) }
              onClick={ () => this.handleMenuClose('SU') }
            >
              <FormattedMessage
                id='signUpVolunteer'
                default='Sign Up As Volunteer'
              />
            </SliderButton>
          </Menu>
          <SliderButton
            to={ formatLink('/sign_in', locale) }
          >
            <FormattedMessage
              id='logIn'
              defaultMessage='Login'
            />
          </SliderButton>
          { this.renderLanguageMenu() }
        </div>
      );
    }
  }

  renderRoleLinks() {
    const { currentUser: { client, locale } } = this.props;

    return (
      <div className='roleLinks'>
        {
          client
          ?
          (
            <SliderButton
              to={ formatLink('/search', locale) }
            >
              <FormattedMessage
                id='search'
                defaultMessage='Search'
              />
            </SliderButton>
          )
          :
          (
            <span>
              <SliderButton
                to={ formatLink('/availabilities/new', locale) }
              >
                <FormattedMessage
                  id='availabilityCreateNew'
                />
              </SliderButton>
              <SliderButton
                to={ formatLink('/availabilities', locale) }
              >
                <FormattedMessage
                  id='availabilitiesLink'
                  defaultMessage='Availabilities'
                />
              </SliderButton>
            </span>
          )
        }
      </div>
    );
  }

  rendersignedInHeader() {
    const { currentUser: { locale } } = this.props;
    return (
      <div className='signedInHeader'>
        { this.renderRoleLinks() }
        <span className='inboxButton'>
          <SliderButton
            to={ formatLink('/inbox', locale) }
          >
            <FormattedMessage
              id='inboxLink'
            />
          </SliderButton>
        </span>
      </div>
    );
  }

  renderSignedInProfile() {
    const { currentUser, currentUser: { locale } } = this.props;
    if(!_.isEmpty(currentUser)) {
      if(this.props.mobile) {
        return(
          <span className='signedOutMenuMobile'>
            <ExpansionPanel
              classes={ { root: 'signedOutMenuMobilePanel', rounded: 'signedOutMenuMobilePanelRounded' } }
            >
              <ExpansionPanelSummary
                expandIcon={ (
                  <FaChevronDown
                    className='signUpMenuChevron'
                  />
                ) }
                classes={ { root: 'signedOutMenuSummary', content: 'signedOutMenuSummaryContent' } }
              >
                <FormattedMessage
                  id='userLabel'
                  defaultMessage='User: {username}'
                  values={ { username: currentUser.first_name } }
                />
              </ExpansionPanelSummary>
              <ExpansionPanelDetails
                classes={ { root: 'signedOutMenuContent' } }
              >
                <SliderButton
                  to={ formatLink('/my_profile', locale) }
                >
                  <FormattedMessage
                    id='profileLink'
                    default='My profile'
                  />
                </SliderButton>
                <SliderButton
                  onClick={ () => this.handleSignOut() }
                >
                  <FormattedMessage
                    id='signOutLink'
                    default='Sign out'
                  />
                </SliderButton>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </span>
        );
      } else {
        return(
          <span className='profileMenuContainer'>
            <SliderButton grey onClick={ (event) => this.handleMenuOpen(event, menu.PROFILE) }>
              <Avatar src={ this.state.profilePicSrc } onError={ this.handleProfilePicError }>
                { currentUser.first_name.charAt(0).toUpperCase() }
              </Avatar>
            </SliderButton>
            <Menu
              className='profileMenu'
              keepMounted
              anchorEl={ this.state.PRAnchorEl }
              getContentAnchorEl={ null }
              anchorOrigin={ {vertical: 'bottom', horizontal: 'center'} }
              transformOrigin={ {vertical: 'top', horizontal: 'center'} }
              open={ Boolean(this.state.PRAnchorEl) }
              onClose={ () => this.handleMenuClose('PR') }
            >
              <SliderButton
                to={ formatLink('/my_profile', locale) }
                onClick={ () => this.handleMenuClose('PR')  }
              >
                <FormattedMessage
                  id='profileLink'
                  default='Profile'
                />
              </SliderButton>
              <SliderButton
                onClick={ () => { this.handleSignOut(); this.handleMenuClose('PR'); } }
              >
                <FormattedMessage
                  id='signOutLink'
                  default='Sign out'
                />
              </SliderButton>
            </Menu>
          </span>
        );
      }
    }
  }
}

Header.propTypes = {
  currentUser: PropTypes.object.isRequired,
  mobile: PropTypes.bool.isRequired,
  locale: PropTypes.string,
};

Header.defaultProps = {
  locale: ENGLISH,
};

export default Header;
