'use strict';

function isArray(object){
  return object !== null && object !== undefined && object.constructor === Array;
}

function isBasicObject(object){
  return object === Object(object);
}

var fileConstantIsDefined = typeof File === 'function';

function isFile(object){
  return fileConstantIsDefined && object.constructor === File
}

function buildFormDataAttributes(key, value){
  var formData = [];

  if(isArray(value)){
    var prefix = key + '[]';

    if(value.length === 0){
      formData.push([prefix, null]);
    } else {
      for(var arrayIndex in value){
        formData = formData.concat(buildFormDataAttributes(prefix, value[arrayIndex]));
      }
    }

  } else if(value && !isFile(value) && isBasicObject(value)){
    for(var objectKey in value){
      if(!value.hasOwnProperty(objectKey)){ continue; }

      formData = formData.concat(buildFormDataAttributes(key + '[' + objectKey +']', value[objectKey]));
    }

  } else {
    formData.push([key, value]);
  }

  return formData;
}

module.exports  = {
  from: function(json){
    var formData = [];

    if(json !== null || json !== undefined){

      for(var key in json){
        if(!json.hasOwnProperty(key)){ continue; }

        formData = formData.concat(buildFormDataAttributes(key, json[key]));
      }

    }

    return formData;
  }
};
