import _ from 'lodash';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

import PaypalButton from '../PaypalButton';

import './Header.css';

import { getData } from '../utils/sendData';
import HomeLink from './HomeLink';

class Header extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleSignOut = this.handleSignOut.bind(this);
    this.handleClickMenu = this.handleClickMenu.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);

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
      return (
        <nav className={ navigationClassName } >
          <HomeLink />

          { this.renderRoleLinks() }

          <a href='/my_profile' className='slidingLink' >
            <FormattedMessage
              id='profileLink'
              defaultMessage='Profile'
            />
          </a>

          <a href='/inbox' className='slidingLink' >
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

          <a href='/sign_up/volunteer' className='slidingLink'>
            <FormattedMessage
              id='signUpVolunteer'
            />
          </a>
          <a href='/sign_up/client' className='slidingLink' >
            <FormattedMessage
              id='signUpClient'
            />
          </a>
          <a href='/sign_in/' className='slidingLink'>
            <FormattedMessage
              id='signIn'
            />
          </a>
          { this.renderStaticButtons() }
        </nav>
      );
    }
  }

  renderStaticButtons() {
    return [
      <a key='about' href='/about' className='slidingLink'>
        <FormattedMessage
          id='aboutPage'
        />
      </a>,
      <PaypalButton key='paypal' />
    ];
  }

  renderRoleLinks() {
    if (this.props.currentUser.client) {
      return (
        <a href='/search' className='slidingLink'>
          <FormattedMessage
            id='search'
            defaultMessage='Search'
          />
        </a>
      );
    } else if (this.props.currentUser.volunteer) {
      return (
        <span>
          <a href='/availabilities/new' className='slidingLink'>
            <FormattedMessage
              id='availabilityCreateNew'
            />
          </a>

          <a href='/availabilities' className='slidingLink'>
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
        location.assign('/');
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
