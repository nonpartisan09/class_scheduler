import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Snackbar from 'material-ui/Snackbar';

class SnackBarComponent extends Component {
  render() {
    return (
      <Snackbar
        open
        message={ this.props.message }
        autoHideDuration={ 2000 }
      />
    );
  }
}

SnackBarComponent.propTypes = {
  message: PropTypes.object,
};

SnackBarComponent.defaultProps = {
  message: {}
};
export default SnackBarComponent;
