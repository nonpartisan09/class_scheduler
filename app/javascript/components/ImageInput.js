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

    this.updateProgress = this.updateProgress.bind(this);
    this.handleOnLoad = this.handleOnLoad.bind(this);
    this.handleShowDialog = this.handleShowDialog.bind(this);

    this.state = {
      progress: props.url ? 100 : 0,
      dataUrl: '',
      readingImage: false,
      invalidFileDialog: false
    };
  }

  componentWillMount(){
    const { url, image } = this.props;
    const { dataUrl, readingImage } = this.state;

    const dataUrlNeedsToBeReadFromImage = !(url || dataUrl || readingImage) && image;

    if (dataUrlNeedsToBeReadFromImage) {

      this.setState({
        readingImage: true
      });

      const reader = new FileReader();

      reader.onload = ({ target: { result: url } }) => {
        this.setState({
          dataUrl: url,
          readingImage: false
        });
      };

      reader.readAsDataURL(image);
    }
  }

  render() {
    const { onChange, onBlur } = this.props;
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
            onLoadStart={ this.updateProgress }
            onProgress={ this.updateProgress }
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
      const { progress, dataUrl } = this.state;

      if (progress > 0 && progress < 100) {
        return(
          <CircularProgress mode='determinate' value={ progress } />
        );

      } else {
        const { icon } = this.props;

        if (icon && !(dataUrl || value)) {
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
  }

  handleOnLoad({ target: { result: url } }, image){
    const { onLoad } = this.props;

    this.setState({
      dataUrl: url
    });

    onLoad(image);
  }

  updateProgress({ loaded = 1, total = 100}){
    this.setState({
      progress: (loaded / total) * 100
    });
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
  value: PropTypes.string,
  icon: PropTypes.object,
  image: PropTypes.object,

  onLoad: PropTypes.func,
  onChange: PropTypes.func,
  onBlur: PropTypes.func
};

ImageInput.defaultProps = {
  value: '',
  onLoad: ()=>{},
  onChange: ()=>{},
  onBlur: ()=>{}
};

export default ImageInput;
