import _ from 'lodash';
import METHODS from './RestConstants';

function flatMapErrors(errors) {
  return  _.flatMap(Object.entries(errors), (item) => {
      return _.capitalize(item.join(' ').replace(/_/g, ' '));
  }).join(',');
}

function getData({ url, params='', jsonBody, method='GET', successCallBack, errorCallBack }) {
  const body = jsonBody? JSON.stringify(jsonBody) : null;
  const restUrl = params? `${url}?${params}` : url;

  return fetch(restUrl, {
    method: METHODS[method],
    body,
    headers: {
      'X-CSRF-Token': getCSRFToken(),
    },
    credentials: 'same-origin'
  }).then(response => {
    if (response.status < 400) {

      if (response.status === 204) {
        if (!_.isUndefined(successCallBack)) {
          return successCallBack({ }, response.status);
        }
      } else {
        return response.json().then((json) => {
          if (!_.isUndefined(successCallBack)) {
            return successCallBack(json, response.status);
          }
        });
      }
    } else if (response.status < 500) {

      response.json().then((item) => {
        const { errors, error } = item;
        const errorMessage = error && error.message ? error.message : flatMapErrors(errors);
        return errorCallBack(errorMessage);
      });
    }
  }).catch((e) => {
    console.warn(e);
  });
}

function postData({ url, params, attributes, method='POST', successCallBack, errorCallBack }) {
  const restUrl = params? `${url}?${params}` : url;
  const body = function(){
    if (_.size(attributes) > 0) {
      const body = new FormData();

      _.each(attributes, ([name, value]) => {
        body.append(name, value);
      });

      return body;
    } else {
      return null;
    }
  }();

  return fetch(restUrl, {
    method: METHODS[method],
    body,
    headers: {
      'X-CSRF-Token': getCSRFToken(),
    },
    credentials: 'same-origin'
  }).then(response => {
    if (response.status < 400) {
      if (response.status === 204 || response.status === 302) {
        if (!_.isUndefined(successCallBack)) {
          return successCallBack();
        }
      } else {
        const contentType = response.headers.get('content-type');

        if (contentType && contentType.indexOf('application/json') !== -1) {
          return response.json().then((json) => {
            if (!_.isUndefined(successCallBack)) {
              return successCallBack(json);
            }
          });
        } else {
          return response.text().then((text) => {
            if (!_.isUndefined(successCallBack)) {
              return successCallBack(text);
            }
          });
        }
      }
    } else if (response.status < 500) {

      response.json().then((item) => {
        const { errors, error, message } = item;

        const errorMessage = function(){
          if (error && error.message) {
            return _.isArray(error.message.length)? error.message.join(',') : error.message;
          } else if (errors) {
           return flatMapErrors(errors);
          } else if (message) {
            return message;
          }
        }();

        return errorCallBack(errorMessage);
      });
    }
  }).catch((e) => {
    console.warn(e);
  });
}

function getCSRFToken() {
  return _.find(document.getElementsByTagName('meta'), (meta) => {
    return meta.name === 'csrf-token';
  }).content;
}

export {
  getData,
  postData,
  flatMapErrors
};
