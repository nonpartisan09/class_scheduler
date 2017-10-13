import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: '',
    };
  }

  componentDidMount(){
    this.checkCookie()
  }

  componentWillUpdate() {
    return document.cookie && ( document.cookie.split(';', 2)[0].split('=', 2)[1] !== this.state.user )
  }

  render() {

   if ( this.state.user ) {
     return (
       <nav className='navigation' >

         { this.renderRoleLinks() }

         <Link to='/my_profile' className='sliding-u-l-r-l' rel='nofollow'>
           { this.state.user }
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
    if (this.state.role === 'student') {
      return (
        <Link to={ '/search' } className='sliding-u-l-r-l'>
          Search
        </Link>
      );
    } else if ( this.state.role === 'teacher') {
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

  checkCookie() {
    if (document.cookie) {
      const cookies = document.cookie.split(';', 2);

      this.setState({
        user: cookies[0].split('=', 2)[1],
        role: cookies[1].split('=', 2)[1]
      });
    }
  }
}

export default Header;
