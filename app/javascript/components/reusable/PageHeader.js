import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './PageHeader.css';

class PageHeader extends Component {

  render() {
    return (
      <div className='pageHeaderContainer'>
        <h1 className='pageHeader'>
          { this.props.title }
        </h1>
      </div>
    );
  }

}

PageHeader.propTypes = {
  title: PropTypes.node.isRequired
};

PageHeader.defaultProps = {

};

export default PageHeader;
