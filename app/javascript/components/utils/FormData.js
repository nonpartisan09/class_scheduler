import _ from 'lodash';

function isArray(object){
  return object !== null && object !== undefined && object.constructor === Array;
}

function isBasicObject(object){
  return object === Object(object);
}

const fileConstantIsDefined = typeof File === 'function';

function isFile(object){
  return fileConstantIsDefined && object.constructor === File;
}

function buildFormDataAttributes(key, value){
  let formData = [];

  if(isArray(value)){
    let prefix = key + '[]';

    if(value.length === 0){
      formData.push([prefix, null]);
    } else {
      for(let arrayIndex in value){
        if(!value.hasOwnProperty(arrayIndex)){ continue; }

        formData = formData.concat(buildFormDataAttributes(prefix, value[arrayIndex]));
      }
    }

  } else if(value && !isFile(value) && isBasicObject(value) && !_.isDate(value)){
    for(let objectKey in value){
      if(!value.hasOwnProperty(objectKey)){ continue; }

      formData = formData.concat(buildFormDataAttributes(key + '[' + objectKey +']', value[objectKey]));
    }

  } else {

    formData.push([key, value]);
  }

  return formData;
}

const FormData  = {
  from: function(json){
    let formData = [];

    if(json !== null || json !== undefined){

      for(let key in json){
        if(!json.hasOwnProperty(key)){ continue; }

        formData = formData.concat(buildFormDataAttributes(key, json[key]));
      }

    }

    return formData;
  }
};

export default FormData;
