import React from 'react';
import Dropzone from 'react-dropzone';
import {read} from '../utils/file';
import AvatarEditor from 'react-avatar-editor';
import {translate} from '../utils/translate';
import { Image } from '../utils/cloudinary';

const crop = {
  aspect: 1,
};

class ImageInput extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      raw: "",
      cropped: "",
      edit: false
    }
    this.onDrop = this.onDrop.bind(this);
    this.setCropped = this.setCropped.bind(this);
    this.openEditMode = this.openEditMode.bind(this);
    this.reset = this.reset.bind(this);
  }
  reset () {
    this.setState({raw: "", cropped: "", edit: false})
  }
  onDrop(acceptedFiles, rejectedFiles) {
    read(acceptedFiles[0], raw => { this.setState({raw}) })
  }
  openEditMode() {
    this.setState({edit: true})
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
    const {initial, tr} = this.props;
    const {raw, cropped, edit} = this.state;

    return <Image publicId="profile_src/bxnfdi6oh6ibnczedng5" />;
    // if (!edit && initial) {
    //   return (
    //     <div className="thumbnail-editor-preview"
    //       style={{
    //         backgroundImage: `url(${initial})`
    //       }}
    //       onClick={this.openEditMode}>
    //       <span>Click to upload a new picture.</span>
    //     </div>
    //   )
    // } else if (raw) {
    //   return (
    //     <div className="upload-input">
    //       <AvatarEditor
    //         ref={c => c ? this.cropped = c : null}
    //         onLoadSuccess={this.setCropped}
    //         onImageChange={this.setCropped}
    //         image={raw}
    //         width={250}
    //         height={250}
    //         border={50}
    //         color={[255, 255, 255, 0.6]} // RGBA 
    //         scale={1.2}
    //         rotate={0}
    //       />
    //       <button onClick={this.reset}>reset</button>
    //       <button>OK</button>
    //    </div>

    //   )
    // } else {
    //   return (
    //       <div className="upload-input">
    //         <Dropzone onDrop={this.onDrop}>
    //           <div>{tr("edit_thumbnail")}</div>
    //         </Dropzone>
    //       </div>
    //   );
    // }
  }
}

export default translate("Form")(ImageInput);