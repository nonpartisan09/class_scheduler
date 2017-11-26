import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Courses from './Courses';

import Header from './Header';
import './Homepage.css';

class Homepage extends Component {
  render() {
    return (
      <div>
        <Header currentUser={ this.props.currentUser } />
        <div className='homepageContainer'>
          <img
            className='homepageImage'
            src={ '/assets/community_2000.jpg' }
            alt='Learn and teach community'
            srcSet={ ` ${'/assets/community_200.jpg'} 200w,
            ${'/assets/community_400.jpg'} 400w,
            ${'/assets/community_600.jpg'} 600w,
            ${'/assets/community_800.jpg'} 800w,
            ${'/assets/community_1000.jpg'} 1000w,
            ${'/assets/community_1500.jpg'} 1500w,
            ${'/assets/community_2000.jpg'} 2000w,
            ${'/assets/community_2000.jpg'} 2000w,
            ${'/assets/community_4000.jpg'} 4000w` }
          />
          <div className='mask'>
            <h1>
              <img className='logo' alt='tutoria logo' src={ '/assets/tutoria_logo_light_blue_and_white_web.png' } />
            </h1>
            <h2 className='subtitle'>
              Connect and share with our community of students and teachers
            </h2>
          </div>
        </div>

        <Courses courses={ this.props.courses } />
      </div>
    );
  }
}

Homepage.propTypes = {
  courses: PropTypes.array,
  currentUser: PropTypes.object,
};

Homepage.defaultProps = {
  courses: [],
  currentUser: { }
};

export default Homepage;


