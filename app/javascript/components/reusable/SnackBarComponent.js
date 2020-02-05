import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { 
  Snackbar,
  IconButton,
  SnackbarContent
 } from '@material-ui/core';
 import { FaTimes, FaExclamationCircle } from 'react-icons/fa';

class SnackBarComponent extends Component {
  render() {
    const exclamationSize = 25;

    return (
      <Snackbar
        classes={ { root: 'snackBar' } }
        open={ this.props.open }
      >
        <SnackbarContent
          classes={ { root: 'snackBarContent' } }
          message={ (
            <span id='snackbar-message' className='snackBarMessage'>
              <FaExclamationCircle
                className='errorExclamationIcon'
                size={ exclamationSize }
              />
              <span id='snackbar-message-text' className='snackBarMessageText'>
                { this.props.message }
              </span>
            </span>
          ) }
          action={ (
            <IconButton key="close" aria-label="Close" color="inherit" onClick={ this.props.handleClose }>
              <FaTimes />
            </IconButton>
           ) }
        />
      </Snackbar>
    );
  }
}

SnackBarComponent.propTypes = {
  message: PropTypes.oneOfType([ PropTypes.string, PropTypes.object ]),
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

SnackBarComponent.defaultProps = {
  message: {}
};
export default SnackBarComponent;
