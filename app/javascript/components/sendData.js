import _ from 'lodash';

const METHODS = {
  POST: 'POST',
  GET: 'GET',
  DELETE: 'DELETE',
  PUT: 'PUT',
};

function getData({ url, params, jsonBody, method='GET', successCallBack, errorCallBack }) {
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
        const errorMessage = error && error.message ? error.message : _.flatMap(Object.entries(errors), (item) => {
          return _.capitalize(item.join(' ').replace(/_/g, ' '));
        }).join(',');
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
        return response.text().then(() => {
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

export {
  getData,
  postData
};
