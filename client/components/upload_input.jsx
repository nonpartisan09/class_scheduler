import React from 'react'
import Dropzone from 'react-dropzone'
import {read} from '../utils/file'
import AvatarEditor from 'react-avatar-editor'

const crop = {
  aspect: 1/1,
}

class UploadInput extends React.Component {
  constructor() {
    super()
    this.state = {
      raw: "",
      cropped: ""
    }
    this.onDrop = this.onDrop.bind(this);
    this.setCropped = this.setCropped.bind(this);
  }
  onDrop(acceptedFiles, rejectedFiles) {
    read(acceptedFiles[0], raw => { this.setState({raw}) })
  }
  setCropped(){
    this.cropped.getImageScaledToCanvas().toBlob(cropped => {
      read(cropped, cropped => {
        this.setState({cropped}, () => {
          this.props.onChange({
            preventDefault: ()=>{},
            currentTarget: {value: this.state.cropped}
          })
        })
      })
    });  
  }
  render() {
    const {raw, cropped} = this.state;
    if (raw) {
      return (
        <AvatarEditor
          ref={c => c ? this.cropped = c : null}
          onLoadSuccess={this.setCropped}
          onImageChange={this.setCropped}
          image={raw}
          width={250}
          height={250}
          border={50}
          color={[255, 255, 255, 0.6]} // RGBA 
          scale={1.2}
          rotate={0}
        />
      )
    } else {
      return (
          <div className="upload-input">
            <Dropzone onDrop={this.onDrop}>
              <div>Drop Image here, or click to select file to upload.</div>
            </Dropzone>
          </div>
      );
    }
  }
}

export default UploadInput;