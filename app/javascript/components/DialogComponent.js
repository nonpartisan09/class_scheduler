import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Dialog from '@material-ui/core/Dialog';

class DialogComponent extends Component {
  render() {
    const { title, onRequestClose, open, text } = this.props;

    return (
      <Dialog
        title={ title }
        actions={ this.renderActions() }
        modal
        open={ open }
        onRequestClose={ onRequestClose }
      >
        { text }
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
