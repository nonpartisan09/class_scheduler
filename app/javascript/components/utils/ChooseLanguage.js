import _ from 'lodash';

function ChooseLanguage() {
  if (_.includes(_.split(window.location.href), '=')) {
    return _.last(_.split(window.location.href, '='));
  } else {
    return 'en';
  }
}

export default ChooseLanguage;
