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
          <div className='mask'>
            <h1 className='title'>
              Tutoria
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


