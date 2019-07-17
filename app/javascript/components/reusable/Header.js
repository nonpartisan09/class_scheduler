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
} from '@material-ui/core';
import { 
  FaFacebookF,
  FaPhone,
  FaEnvelope,
  FaChevronDown,
  FaBars
} from 'react-icons/fa';

import {
  ENGLISH,
  SPANISH
} from '../utils/availableLocales';
import SliderButton from './SliderButton';
import PaypalButton from '../PaypalButton';
import { getData } from '../utils/sendData';
import HomeLink from './HomeLink';
import formatLink from '../utils/Link';
import SnackBarComponent from './SnackBarComponent';

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
    this.handleLanguageMenuOpen = this.handleLanguageMenuOpen.bind(this);
    this.handleLanguageMenuClose = this.handleLanguageMenuClose.bind(this);
    this.handleSignUpMenuOpen = this.handleSignUpMenuOpen.bind(this);
    this.handleSignUpMenuClose = this.handleSignUpMenuClose.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.renderMobileElements = this.renderMobileElements.bind(this);
    this.handleMenuCollapse = this.handleMenuCollapse.bind(this);
    this.renderLanguageMenu = this.renderLanguageMenu.bind(this);
    this.handleHideSnackBar = this.handleHideSnackBar.bind(this);

    this.state = {
      showSnackBar: false,
      message: '',
      LAnchorEl: null,
      SUAnchorEl: null,
      currentUserLoggedIn: !_.isEmpty(props.currentUser),
      open: false,
      mobile: false
    };
  }

  render() {
    const menuIconSize = 30;

    if (this.state.mobile) {
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
            isOpen={ this.state.showSnackBar }
            message={ this.state.message }
            handleClose={ this.handleHideSnackBar }
          />
        </div>
      );
    } else {
      return(
        <div className='wholeHeader'>
          <AppBar 
            position='static'
            style={ { backgroundColor: 'white' } }
            classes={ { root: 'menuAppBar' } }
          >
            <Toolbar
              classes={ { root: 'menuAppBarHigher' } }
            >
              { this.renderContactElements() }
            </Toolbar>
            <Toolbar
              classes={ { root: 'menuAppBarLower' } }
              title={ this.renderHomeButton() }
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
            isOpen={ this.state.showSnackBar }
            message={ this.state.message }
            handleClose={ this.handleHideSnackBar }
          />
        </div>
      );
    }
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }
  
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }
  
  updateWindowDimensions() {
    if (window.innerWidth < 900) {
      this.setState({ mobile: true });
    } else {
      this.setState({ mobile: false });
    }
  }

  renderMobileElements() {
    return(
      <div className='mobileElements'>
        { this.renderRightElements() }
        <br />
        { this.renderContactElements() }
      </div>
    );
  }

  renderHomeButton() {
    return(
      <HomeLink className='headerHomeLink' />
    );
  }

  handleHideSnackBar() {
    this.setState({ showSnackBar: false });
  }

  handleMenuCollapse() {
    const isOpen = this.state.open;
    this.setState({ open: !isOpen });
  }

  renderRightElements() {
    const { currentUser: { locale } } = this.props;

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
            href={ formatLink('/faq', locale) }
          >
            <FormattedMessage
              id='FAQPage'
              defaultMessage='FAQ'
            />
          </SliderButton>
          <SliderButton
            href={ formatLink('/about', locale) }
          >
            <FormattedMessage
              id='aboutPage'
              defaultMessage='About'
            />
          </SliderButton>
          { this.renderLanguageMenu() }
          <PaypalButton key='paypal' />
        </div>
      </div>
    );
  }

  renderLanguageMenu() {
    const currentLocale = localStorage.getItem('locale');
    const languageEnglishValue = 'English';
    const languageSpanishValue = 'Español';

    if (this.state.mobile) {
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
            onClick={ this.handleLanguageMenuOpen }
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
            anchorEl={ this.state.LAnchorEl }
            open={ Boolean(this.state.LAnchorEl) }
            onClose={ this.handleLanguageMenuClose }
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

  handleLanguageMenuOpen(event) {
    this.setState({ LAnchorEl: event.currentTarget });
  }

  handleLanguageMenuClose() {
    this.setState({LAnchorEl: null });
  }

  handleSignUpMenuOpen(event) {
    this.setState({ SUAnchorEl: event.currentTarget });
  }

  handleSignUpMenuClose() {
    this.setState({ SUAnchorEl: null });
  }

  renderContactElements() {
    const phoneNumber = '+1-202-555-0159';
    const email = 'admin@tutoria.io';
    const facebook = 'Facebook';
    const facebookLink = 'https://www.facebook.com/Tutoria-416182735512904/';
    const size = 20;

    return(
      <div className='contactElements'>
        <SliderButton
          grey
          href={ 'tel:'+phoneNumber }
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
          { phoneNumber }
        </SliderButton>
        <SliderButton
          grey
          href={ 'mailto:'+email }
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
          { email }
        </SliderButton>
        <SliderButton
          grey
          href={ facebookLink }
        >
          <FaFacebookF
            size={ size }
            label='Facebook'
          />
          { facebook }
        </SliderButton>
      </div>
    );
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
    this.handleLanguageMenuClose();
  }

  rendersignedInHeader() {
    return (
      <div className='signedInHeader'>
        { this.renderRoleLinks() }
      </div>
    );
  }

  renderSignedOutHeader() {
    const { currentUser: { locale } } = this.props;
    
    if (this.state.mobile) {
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
                href={ formatLink('/sign_up/client', locale) }
              >
                <FormattedMessage
                  id='signUpClient'
                  default='Sign Up As Client'
                />
              </SliderButton>
              <SliderButton
                href={ formatLink('/sign_up/volunteer', locale) }
              >
                <FormattedMessage
                  id='signUpVolunteer'
                  default='Sign Up As Volunteer'
                />
              </SliderButton>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <SliderButton
            href={ formatLink('/sign_in', locale) }
          >
            <FormattedMessage
              id='logIn'
              defaultMessage='Login'
            />
          </SliderButton>
        </div>
      );
    } else {
      return (
        <div className='signedOutHeader'>
          <SliderButton
            onClick={ this.handleSignUpMenuOpen }
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
            open={ Boolean(this.state.SUAnchorEl) }
            onClose={ this.handleSignUpMenuClose }
          >
            <a href={ formatLink('/sign_up/client', locale) }>
              <SliderButton
              >
                <FormattedMessage
                  id='signUpClient'
                  default='Sign Up As Client'
                />
              </SliderButton>
            </a>
            <a href={ formatLink('/sign_up/volunteer', locale) }>
              <SliderButton
              >
                <FormattedMessage
                  id='signUpVolunteer'
                  default='Sign Up As Volunteer'
                />
              </SliderButton>
            </a>
          </Menu>
          <SliderButton
            href={ formatLink('/sign_in', locale) }
          >
            <FormattedMessage
              id='logIn'
              defaultMessage='Login'
            />
          </SliderButton>
        </div>
      );
    }
  }

  renderRoleLinks() {
    const { currentUser: { client, locale } } = this.props;

    return (
      <div className='roleLinks'>
        <SliderButton
          onClick={ this.handleSignOut }
        >
          <FormattedMessage
            id='signOutLink'
            defaultMessage='Sign Out'
          />
        </SliderButton>
        { 
          client
          ?
          (
            <SliderButton
              href={ formatLink('/search', locale) }
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
                href={ formatLink('/availabilities/new', locale) }
              >
                <FormattedMessage
                  id='availabilityCreateNew'
                />
              </SliderButton>
              <SliderButton
                href={ formatLink('/availabilities', locale) }
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
}

Header.propTypes = {
  currentUser: PropTypes.object,
};

Header.defaultProps = {
  currentUser: { }
};

Header.contextTypes = {
  router: PropTypes.object
};

export default Header;
