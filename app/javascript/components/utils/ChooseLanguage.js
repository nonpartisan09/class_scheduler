import _ from 'lodash';
import { ENGLISH, SPANISH } from './available_locales';

function ChooseLanguage() {
  const currentUrl = _.split(window.location.href, '/');
  if (currentUrl[3] === ENGLISH || currentUrl[3] === SPANISH) {
    return currentUrl[3];
  } else {
    return ENGLISH;
  }
}

export default ChooseLanguage;
