import _ from 'lodash';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Header.css';

import { getData } from './sendData';

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

    if ( _.size(this.props.currentUser) > 0 ) {
      return (
        <nav className={ navigationClassName } >
          <a href={ '/' } className='slidingLink' rel='nofollow'>
            Home
          </a>

          { this.renderRoleLinks() }

          <a href={ '/my_profile' } className='slidingLink' rel='nofollow'>
            { this.props.currentUser.first_name }
          </a>

          <span role='navigation' tabIndex={ 0 } onClick={ this.handleSignOut } className='slidingLink' rel='nofollow'>
            Sign out
          </span>
        </nav>
      );
    }
    else {
      return (
        <nav className={ navigationClassName } >
          <a href={ '/sign_up/client' } className='slidingLink' >
            Become a client
          </a>
          <a href={ '/sign_up/volunteer' } className='slidingLink'>
            Volunteer as a teacher
          </a>
          <a href={ '/sign_in/' } className='slidingLink'>
            Sign In
          </a>
        </nav>
      );
    }
  }

  renderRoleLinks() {
    if (this.props.currentUser.client) {
      return (
        <a href={'/search'} className='slidingLink'>
          Search
        </a>
      );
    } else if (this.props.currentUser.teacher) {
      return (
        <span>
          <a href={'/availabilities/new'} className='slidingLink'>
            Create a new availability
          </a>

          <a href={'/availabilities'} className='slidingLink'>
            My Availabilities
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
