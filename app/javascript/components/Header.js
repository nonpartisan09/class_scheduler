import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './Header.css';

class Header extends Component {
  render() {
   if ( _.size(this.props.currentUser) > 0 ) {
     return (
       <nav className='navigation' >

         { this.renderRoleLinks() }

         <Link to='/my_profile' className='sliding-u-l-r-l' rel='nofollow'>
           { this.props.currentUser.display_name }
         </Link>
         <a data-method='delete' href={ '/sign_out' } className='sliding-u-l-r-l' rel='nofollow'>
           Sign Out
         </a>
       </nav>
     );
   } else {
     return (
       <nav className='navigation' >
         <a href={'/sign_up/student' } className='sliding-u-l-r-l' >
           Become a student
         </a>
         <a href={'/sign_up/volunteer'} className='sliding-u-l-r-l'>
           Volunteer as a teacher
         </a>
         <a href={ '/sign_in/' } className='sliding-u-l-r-l'>
           Sign In
         </a>
       </nav>
     );
   }
  }

  renderRoleLinks() {
    if (this.props.currentUser.student) {
      return (
        <Link to={ '/search' } className='sliding-u-l-r-l'>
          Search
        </Link>
      );
    } else if (this.props.currentUser.teacher) {
      return (
        <span>
          <Link to='/availabilities/new' className='sliding-u-l-r-l'>
            Create a new availability
          </Link>

          <Link to='/availabilities' className='sliding-u-l-r-l'>
            My Availabilities
          </Link>
        </span>
      );
    }
  }
}

Header.propTypes = {
  currentUser: PropTypes.object,
};

Header.defaultProps = {
  currentUser: { }
};

export default Header;
