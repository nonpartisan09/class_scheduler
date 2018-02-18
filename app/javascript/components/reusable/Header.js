import _ from 'lodash';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';
import { ENGLISH, SPANISH } from '../utils/availableLocales';

import PaypalButton from '../PaypalButton';

import './Header.css';

import { getData } from '../utils/sendData';
import HomeLink from './HomeLink';
import formatLink from '../utils/Link';

class Header extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleSignOut = this.handleSignOut.bind(this);
    this.handleClickMenu = this.handleClickMenu.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleSetGuestLocale = this.handleSetGuestLocale.bind(this);

    this.state = {
      showSnackBar: false,
      message: '',
      showLinks: false
    };
  }
  render() {
    const mobile = true;

    return(
      <div>
        <div className='navMenuButton' role='button' onKeyDown={ this.handleKeyDown } tabIndex={ 0 } onClick={ this.handleClickMenu }>
          <MenuIcon />
          { this.renderLinks(mobile) }
        </div>

        { this.renderLinks() }
      </div>
    );
  }

  renderLinks(mobile) {
    const { currentUser } = this.props;
    const { showLinks } = this.state;

    const navigationClassName = function(){
      if (mobile) {
        if (showLinks) {
          return 'navigation navDisplay';
        } else {
          return 'navigation navDisplayNone';
        }
      } else {
        return 'navigation';
      }
    }();

    if ( _.size(currentUser) > 0 ) {
      const { locale } = currentUser;
      return (
        <nav className={ navigationClassName } >
          <HomeLink locale={ locale } />

          { this.renderRoleLinks() }

          <a href={ formatLink('/my_profile', locale) } className='slidingLink' >
            <FormattedMessage
              id='profileLink'
              defaultMessage='Profile'
            />
          </a>

          <a href={ formatLink('/inbox', locale) } className='slidingLink' >
            <FormattedMessage
              id='inboxLink'
              defaultMessage='Inbox'
            />
          </a>

          <span role='button' tabIndex={ 0 } onClick={ this.handleSignOut } className='slidingLink' >
            <FormattedMessage
              id='signOutLink'
              defaultMessage='Sign out'
             />
          </span>

          { this.renderStaticButtons() }
        </nav>
      );
    }
    else {
      return (
        <nav className={ navigationClassName } >
          <HomeLink />

          <a href={ formatLink('/sign_up/volunteer') } className='slidingLink'>
            <FormattedMessage
              id='signUpVolunteer'
            />
          </a>
          <a href={ formatLink('/sign_up/client') } className='slidingLink' >
            <FormattedMessage
              id='signUpClient'
            />
          </a>
          <a href={ formatLink('/sign_in') }  className='slidingLink'>
            <FormattedMessage
              id='signIn'
            />
          </a>
          { this.renderStaticButtons() }
          { this.renderGuestChangeLocale() }
        </nav>
      );
    }
  }

  renderGuestChangeLocale() {
    return (
      <div className='headerLocaleLinkContainer' onClick={ this.handleSetGuestLocale }>
        <button value={ ENGLISH } className='slidingLink'>English</button> / <button value={ SPANISH } className='slidingLink'> Español</button>
      </div>
    );
  }

  handleSetGuestLocale({ target }) {
    if (target.value) {
      localStorage.setItem('locale', target.value);
      const pathname = _.split(window.location.pathname, '/');
      const localePattern = new RegExp(`(${ENGLISH}|${SPANISH})`);
      const currentGuestLocale = pathname[1] || '';
      const isGuestLocaleAsExpected = localePattern.test(currentGuestLocale);

      if (isGuestLocaleAsExpected) {
        const newPathname = _.drop(pathname, 2).join('/');
        location.assign(formatLink(`/${newPathname}`, target.value));
      } else {
        location.assign(formatLink(window.location.pathname, target.value));
      }
    }
  }
  renderStaticButtons() {

    const { currentUser: { locale } } = this.props;
    return [
      <a key='about' href={ formatLink('/about', locale) } className='slidingLink'>
        <FormattedMessage
          id='aboutPage'
          defaultMessage='About'
        />
      </a>,
      <PaypalButton key='paypal' />
    ];
  }

  renderRoleLinks() {
    const { currentUser: { client, volunteer, locale } } = this.props;

    if (client) {
      return (
        <a href={ formatLink('/search', locale) } className='slidingLink'>
          <FormattedMessage
            id='search'
            defaultMessage='Search'
          />
        </a>
      );
    }

    if (volunteer) {
      return (
        <span>
          <a href={ formatLink('/availabilities/new', locale) } className='slidingLink'>
            <FormattedMessage
              id='availabilityCreateNew'
            />
          </a>

          <a href={ formatLink('/availabilities', locale) } className='slidingLink'>
            <FormattedMessage
              id='availabilitiesLink'
              defaultMessage='Availabilities'
            />
          </a>
        </span>
      );
    }
  }

  setLinkState() {
    const { showLinks } = this.state;

    this.setState({
      showLinks: !showLinks
    });
  }

  handleKeyDown(event) {
    if (event.keycode === 13) {
     this.setLinkState();
    }
  }

  handleClickMenu() {
    this.setLinkState();
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
