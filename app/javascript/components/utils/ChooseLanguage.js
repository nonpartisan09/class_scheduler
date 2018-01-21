import _ from 'lodash';

function ChooseLanguage() {
  if (window.location.href.match(/=.*$/)) {
    return _.last(_.split(window.location.href, '='));
  } else {
    return 'en';
  }
}

export default ChooseLanguage;
