import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './Courses.css';

class Courses extends Component {
  render() {
    if (_.size(this.props.courses) > 0) {
      return (
        <div>
          <h3 className='courseHeader'>
            Available Classes
          </h3>
          <div className='courseContainer'>
            { this.renderClasses() }
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  renderClasses() {
    const { courses } = this.props;

    if (_.size(courses) > 0) {
      return courses.map((item) => {
        return (
          <div key={ item.id } className='course' style={ { background: `url(/assets/${item.url_slug}.jpg) no-repeat center` } }>
            <div className='courseLabel'>
              { item.name }
            </div>
          </div>
        );
      });
    }
  }

}

Courses.propTypes = {
  courses: PropTypes.array
};

Courses.defaultProps = {
  courses: [ ]
};

export default Courses;
