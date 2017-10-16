import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './Header.css';

class Header extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleSignOut = this.handleSignOut.bind(this);
  }
  render() {
   if ( _.size(this.props.currentUser) > 0 ) {
     return (
       <nav className='navigation' >

         { this.renderRoleLinks() }

         <a href={'/my_profile'} className='sliding-u-l-r-l' rel='nofollow'>
           { this.props.currentUser.display_name }
         </a>
         <span onClick={ this.handleSignOut } className='sliding-u-l-r-l' rel='nofollow'>
           Sign out
         </span>
       </nav>
     );
   } else {
     return (
       <nav className='navigation' >
         <a href={'/sign_up/student'} className='sliding-u-l-r-l' >
           Become a student
         </a>
         <a href={'/sign_up/volunteer'} className='sliding-u-l-r-l'>
           Volunteer as a teacher
         </a>
         <a href={'/sign_in/'} className='sliding-u-l-r-l'>
           Sign In
         </a>
       </nav>
     );
   }
  }

  renderRoleLinks() {
    if (this.props.currentUser.student) {
      return (
        <a href={'/search'} className='sliding-u-l-r-l'>
          Search
        </a>
      );
    } else if (this.props.currentUser.teacher) {
      return (
        <span>
          <a href={'/availabilities/new'} className='sliding-u-l-r-l'>
            Create a new availability
          </a>

          <a href={'/availabilities'} className='sliding-u-l-r-l'>
            My Availabilities
          </a>
        </span>
      );
    }
  }

  handleSignOut() {
    return fetch(`/sign_out?${this.props.currentUser.id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-Token': this.getCSRFToken(),
      },
      credentials: 'same-origin'
    }).then(response => {
      if (response.status < 400) {
        const { router } = this.context;
        router.history.push('/');
      } else if (response.status < 500) {

        if (response.status === 401) {

          response.json().then(({ message }) => {
            return this.setState({
              serverError: message
            });
          });
        }
      }
    })
  }

  getCSRFToken() {
    return _.find(document.getElementsByTagName('meta'), (meta) => {
      return meta.name === 'csrf-token'
    }).content
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
