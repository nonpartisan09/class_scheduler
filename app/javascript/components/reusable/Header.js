import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  FlatButton
} from 'material-ui';
import {
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails
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
import PaypalButton from '../PaypalButton';
import { getData } from '../utils/sendData';
import HomeLink from './HomeLink';
import formatLink from '../utils/Link';

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
        { this.renderContactElements() }
      </div>
    );
  }

  renderHomeButton() {
    return(
      <HomeLink className='headerHomeLink' />
    );
  }

  handleMenuCollapse() {
    const isOpen = this.state.open;
    this.setState({ open: !isOpen });
  }

  renderRightElements() {
    const { currentUser: { locale } } = this.props;
    const style = {
      'color': '#004664',
      'fontFamily': 'Lato',
      'fontSize': '18px',
      'fontWeight': 'bold',
      'paddingLeft': '1pc',
      'paddingRight': '1pc'
    };

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
          <FlatButton
            className='headerlink'
            href={ formatLink('/faq', locale) }
            style={ style }
          >
            <FormattedMessage
              id='FAQPage'
              defaultMessage='FAQ'
            />
          </FlatButton>
          <FlatButton
            href={ formatLink('/about', locale) }
            style={ style }
          >
            <FormattedMessage
              id='aboutPage'
              defaultMessage='About'
            />
          </FlatButton>
          { this.renderLanguageMenu() }
          <PaypalButton key='paypal' />
        </div>
      </div>
    );
  }

  renderLanguageMenu() {
    const style = {
      'color': '#004664',
      'fontFamily': 'Lato',
      'fontSize': '18px',
      'fontWeight': 'bold',
      'paddingLeft': '1pc',
      'paddingRight': '1pc'
    };

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
              <FlatButton
                style={ style }
                value={ ENGLISH }
                onClick={ this.handleSetGuestLocale }
              >
                English
              </FlatButton>
              <FlatButton
                style={ style }
                value={ SPANISH }
                onClick={ this.handleSetGuestLocale }
              >
                Español
              </FlatButton>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
      );
    } else {
      return(
        <div className='languageMenu'>
          <FlatButton
            onClick={ this.handleLanguageMenuOpen }
            style={ style }
            icon={ <FaChevronDown /> }
          >
            <FormattedMessage
              id='Header.selectLanguage'
              defaultMessage='Select Language'
            />
          </FlatButton>
          <Menu
            id="simple-menu"
            keepMounted
            anchorEl={ this.state.LAnchorEl }
            open={ Boolean(this.state.LAnchorEl) }
            onClose={ this.handleLanguageMenuClose }
          >
            <MenuItem
              style={ style }
              value={ ENGLISH }
              onClick={ this.handleSetGuestLocale }
            >
              English
            </MenuItem>
            <MenuItem
              style={ style }
              value={ SPANISH }
              onClick={ this.handleSetGuestLocale }
            >
              Español
            </MenuItem>
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
    const style = {
      'color': 'grey',
    };
    const labelStyle = {
      'textTransform': 'none',
    };

    const phoneNumber = '+1-202-555-0159';
    const email = 'admin@tutoria.io';
    const facebook = 'Facebook';
    const facebookLink = 'https://www.facebook.com/Tutoria-416182735512904/';

    return(
      <div className='contactElements'>
        <FlatButton
          className='contactPhone'
          style={ style }
          icon={ (
            <FaPhone
              label={ (
                <FormattedMessage
                  id="UserForm.phoneNumber"
                  defaultMessage="Phone Number"
                />
              ) }
              />
            ) }
          label={ phoneNumber }
          href={ 'tel:'+phoneNumber }
        />
        <FlatButton
          className='contactEmail'
          style={ style }
          icon={ (
            <FaEnvelope
              label={ (
                <FormattedMessage
                  id="UserForm.email"
                  defaultMessage="Email address"
                />
              ) }
              />
            ) }
          label={ email }
          labelStyle={ labelStyle }
          href={ 'mailto:'+email }
        />
        <FlatButton
          className='contactFaceBook'
          style={ style }
          icon={ (
            <FaFacebookF
              label='Facebook'
              />
            ) }
          label={ facebook }
          labelStyle={ labelStyle }
          href={ facebookLink }
        />
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
    const style = {
      'color': '#004664',
      'fontFamily': 'Lato',
      'fontSize': '18px',
      'fontWeight': 'bold',
      'paddingLeft': '1pc',
      'paddingRight': '1pc'
    };

    if (this.state.mobile) {
      return(
        <div className='signedOutMenuMobile'>
          <ExpansionPanel
            classes={ { root: 'signedOutMenuMobilePanel', rounded: 'signedOutMenuMobilePanelRounded' } }
          >
            <ExpansionPanelSummary
              expandIcon={ (
                <FaChevronDown />
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
              <FlatButton
                style={ style }
                href={ formatLink('/sign_up/client', locale) }
              >
                <FormattedMessage
                  id='signUpClient'
                  default='Sign Up As Client'
                />
              </FlatButton>
              <FlatButton
                style={ style }
                href={ formatLink('/sign_up/volunteer', locale) }
              >
                <FormattedMessage
                  id='signUpVolunteer'
                  default='Sign Up As Volunteer'
                />
              </FlatButton>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <FlatButton
            href={ formatLink('/sign_in', locale) }
            style={ style }
          >
            <FormattedMessage
              id='logIn'
              defaultMessage='Login'
            />
          </FlatButton>
        </div>
      );
    } else {
      return (
        <div className='signedOutHeader'>
          <FlatButton
            onClick={ this.handleSignUpMenuOpen }
            style={ style }
            icon={ <FaChevronDown /> }
          >
            <FormattedMessage
              id='signUp'
              defaultMessage='Sign Up'
            />
          </FlatButton>
          <Menu
            className='signUpMenu'
            keepMounted
            anchorEl={ this.state.SUAnchorEl }
            open={ Boolean(this.state.SUAnchorEl) }
            onClose={ this.handleSignUpMenuClose }
          >
            <a href={ formatLink('/sign_up/client', locale) }>
              <MenuItem
                style={ style }
              >
                <FormattedMessage
                  id='signUpClient'
                  default='Sign Up As Client'
                />
              </MenuItem>
            </a>
            <a href={ formatLink('/sign_up/volunteer', locale) }>
              <MenuItem
                style={ style }
              >
                <FormattedMessage
                  id='signUpVolunteer'
                  default='Sign Up As Volunteer'
                />
              </MenuItem>
            </a>
          </Menu>
          <FlatButton
            href={ formatLink('/sign_in', locale) }
            style={ style }
          >
            <FormattedMessage
              id='logIn'
              defaultMessage='Login'
            />
          </FlatButton>
        </div>
      );
    }
  }

  renderRoleLinks() {
    const { currentUser: { client, locale } } = this.props;
    const style = {
      'color': '#004664',
      'fontFamily': 'Lato',
      'fontSize': '18px',
      'fontWeight': 'bold',
      'paddingLeft': '1pc',
      'paddingRight': '1pc'
    };

    return (
      <div className='roleLinks' >
        <FlatButton
          onClick={ this.handleSignOut }
          style={ style }
        >
          <FormattedMessage
            id='signOutLink'
            defaultMessage='Sign Out'
          />
        </FlatButton>
        {
          client
          ?
          (
            <FlatButton
              href={ formatLink('/search', locale) }
              style={ style }
            >
              <FormattedMessage
                id='search'
                defaultMessage='Search'
              />
            </FlatButton>
          )
          :
          (
            <span>
              <FlatButton
                href={ formatLink('/availabilities/new', locale) }
                style={ style }
              >
                <FormattedMessage
                  id='availabilityCreateNew'
                />
              </FlatButton>

              <FlatButton
                href={ formatLink('/availabilities', locale) }
                style={ style }
              >
                <FormattedMessage
                  id='availabilitiesLink'
                  defaultMessage='Availabilities'
                />
              </FlatButton>
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
