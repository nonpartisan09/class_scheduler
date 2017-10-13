import React, { Component } from 'react';
import Courses from './Courses';

import './Homepage.css';

class Homepage extends Component {
  render() {
    return (
      <div>
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

        <Courses />
    </div>
    );
  }
}

export default Homepage;


