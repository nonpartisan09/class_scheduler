import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './Programs.css';

class Programs extends Component {
  render() {
    if (_.size(this.props.programs) > 0) {
      return (
        <div>
          <h3 className='programHeader'>
            Available Programs
          </h3>
          <div className='programContainer'>
            { this.renderPrograms() }
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  renderPrograms() {
    const { programs } = this.props;

    if (_.size(programs) > 0) {
      return programs.map((item) => {
        return (
          <div key={ item.id } className='program' style={ { background: `url(/assets/${item.url_slug}.jpg) no-repeat center` } }>
            <div className='programLabel'>
              { item.name }
            </div>
          </div>
        );
      });
    }
  }

}

Programs.propTypes = {
  programs: PropTypes.array
};

Programs.defaultProps = {
  programs: [ ]
};

export default Programs;
