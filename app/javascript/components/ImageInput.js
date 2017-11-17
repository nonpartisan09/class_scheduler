import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';

import FileInput from 'react-simple-file-input';
import DialogComponent from './DialogComponent';

import './ImageInput.css';

const allowedFileTypes = [ 'image/png', 'image/jpeg', 'image/gif', 'image/jpg' ];
const maxImageSize = 80000;
const minImageSize = 40000;

function fileIsIncorrectFiletype(file){
  return allowedFileTypes.indexOf(file.type) === -1 || file.size > maxImageSize || file.size <= minImageSize;
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
          actions={ [ <FlatButton key='close' label='Close' primary onClick={ this.handleShowDialog } /> ] }
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

    const effectiveUrl = dataUrl || value;

    if (effectiveUrl) {
      return(
        <div className='imageInputImage'  >
          <img src={ effectiveUrl } alt='User Profile' />
        </div>
      );

    } else {
      const { icon } = this.props;

      if (icon && !dataUrl) {
        return (
          <div className='imageInputImage' >
            <div className='imageInputIcon'>
              { icon }
            </div>
            <div className='imageInputImageCaption'>
              Add your profile picture
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
          Please provide a jpeg, jpg, png or gif image.
        </p>
        <p>
          Image size must be comprised between 40kb and 80kb - the number of pixels depends on the resolution of the image.
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
