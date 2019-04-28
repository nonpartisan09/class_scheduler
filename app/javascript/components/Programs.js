import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';


class Programs extends Component {
  render() {
    if (_.size(this.props.programs) > 0) {
      return (
        <div className='programMainContainer'>
          <h3 className='programHeader'>
            <FormattedMessage
              id='Programs.featuredPrograms'
              defaultMessage='Featured Programs'
            />
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
          <div key={ item.name } className='program'>
            { item.name }
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
