import _ from 'lodash';

const METHODS = {
  POST: 'POST',
  GET: 'GET',
  DELETE: 'DELETE',
  PUT: 'PUT',
};

function sendData({ url, params, jsonBody, method='GET', successCallBack, errorCallBack }) {
  const body = jsonBody? JSON.stringify(jsonBody) : null;
  const restUrl = params? `${url}?${params}` : url;

  return fetch(restUrl, {
    method: METHODS[method],
    body,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-CSRF-Token': getCSRFToken(),
    },
    credentials: 'same-origin'
  }).then(response => {
    if (response.status < 400) {

      if (response.status === 204) {
        if (!_.isUndefined(successCallBack)) {
          return successCallBack();
        }
      } else {
        return response.json().then(() => {
          if (!_.isUndefined(successCallBack)) {
            return successCallBack();
          }
        });
      }
    } else if (response.status < 500) {

      response.json().then((item) => {
        const { errors, error } = item;
        const errorMessage = error && error.message ? error.message : _.flatMap(Object.entries(errors), (item) => {
          return _.capitalize(item.join(' ').replace('_', ' '));
        }).join(',');
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

export default sendData;
