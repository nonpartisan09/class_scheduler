import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';

class DialogComponent extends Component {
  render() {
    const { title, onRequestClose, open, text } = this.props;

    return (
      <Dialog
        open={ open }
        onClose={ onRequestClose }
      >
        <DialogTitle>{ title }</DialogTitle>
        <DialogContent>
          <DialogContentText>{ text }</DialogContentText>
        </DialogContent>
        <DialogActions>
          { this.renderActions() }
        </DialogActions>
      </Dialog>
    );
  }

  renderActions() {
    const { actions } = this.props;
    if (_.size(actions) > 0) {
      return _.map(actions, (item) => item);
    }
  }
}

DialogComponent.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.node.isRequired,
  actions: PropTypes.node,
  onRequestClose: PropTypes.func,
  open: PropTypes.bool
};

DialogComponent.defaultProps = {
  actions: PropTypes.node,
  onRequestClose: PropTypes.func,
  open: PropTypes.bool
};

export default DialogComponent;
