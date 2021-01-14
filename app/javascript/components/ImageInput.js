import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import FlatButton from '@material-ui/core/FlatButton';
import { FormattedMessage } from 'react-intl';

import FileInput from 'react-simple-file-input';
import DialogComponent from './DialogComponent';


const allowedFileTypes = [ 'image/png', 'image/jpeg', 'image/gif', 'image/jpg' ];
const minImageSize = 40000;

function fileIsIncorrectFiletype(file){
  return allowedFileTypes.indexOf(file.type) === -1 || file.size <= minImageSize;
}

class ImageInput extends Component {

  constructor(props, context) {
    super(props, context);

    this.handleOnLoad = this.handleOnLoad.bind(this);
    this.handleShowDialog = this.handleShowDialog.bind(this);

    this.state = {
      dataUrl: '',
      invalidFileDialog: false
    };
  }

  render() {
    return (
      <div>
        <DialogComponent
          title='Invalid Image'
          onRequestClose={ this.handleShowDialog }
          open={ this.state.invalidFileDialog }
          actions={ [
            <FlatButton key='close' primary onClick={ this.handleShowDialog }>
              <FormattedMessage
                id='close'
                defaultMessage='Close'
              />
            </FlatButton> ]
          }
          text={ this.renderDialogText() }
        />

        <label>
          <FileInput
            className='fileInput'
            readAs='dataUrl'
            cancelIf={ fileIsIncorrectFiletype }
            onLoad={ this.handleOnLoad }
            onCancel={ this.handleShowDialog }
          />
          { this.renderContents() }
        </label>
      </div>
    );

  }

  renderContents() {
    const { dataUrl } = this.state;
    const { value } = this.props;

    const effectiveUrl  = function(){
      if (dataUrl) {
        return dataUrl;
      } else if (!_.isEmpty(value) && !_.endsWith(value, 'missing.png')) {
        return value;
      }
    }();

    if (effectiveUrl) {
      return(
        <div className='imageInputImageContainer'>
          <img src={ effectiveUrl } alt='User Profile' className='imageInputImage' />
        </div>
      );

    } else {
      const { icon } = this.props;

      if (icon && !dataUrl) {
        return (
          <div className='imageInputImage'>
            <div className='imageInputIcon'>
              { icon }
            </div>
            <div className='imageInputImageCaption'>
              <FormattedMessage
                id='ImageInput.pictureNew'
                defaultMessage='Add your picture'
              />
            </div>
          </div>
        );
      }
    }
  }

  handleOnLoad({ target: { result: url } }, image){
    const { onLoad } = this.props;

    this.setState({
      dataUrl: url
    });

    onLoad(image);
  }

  handleShowDialog() {
    const { invalidFileDialog } = this.state;

    this.setState({
      invalidFileDialog: !invalidFileDialog
    });
  }

  renderDialogText() {
    return (
      <div>
        <p>
          <FormattedMessage
            id='ImageInput.pictureFormat'
            defaultMessage='Please provide a jpeg, jpg, png or gif image.'
          />
        </p>
        <p>
          <FormattedMessage
            id='ImageInput.pictureSize'
            defaultMessage='Image size must be at least 40kb.'
          />
        </p>
      </div>

    );
  }
}

ImageInput.propTypes = {
  value: PropTypes.oneOfType([ PropTypes.string, PropTypes.object ]),
  icon: PropTypes.object.isRequired,

  onLoad: PropTypes.func,
};

ImageInput.defaultProps = {
  value: '',
  onLoad: ()=>{},
};

export default ImageInput;
