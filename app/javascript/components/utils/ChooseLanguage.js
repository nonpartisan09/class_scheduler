import _ from 'lodash';
import { ENGLISH, SPANISH } from './availableLocales';

function ChooseLanguage() {
  const currentUrl = _.split(window.location.pathname, '/');
  const guestLocale = localStorage.getItem('locale');

  if (guestLocale && (guestLocale === ENGLISH|| guestLocale === SPANISH)) {
    return guestLocale;
  } else if (currentUrl[1] === ENGLISH || currentUrl[1] === SPANISH) {
    return currentUrl[1];
  } else {
    return ENGLISH;
  }
}

export default ChooseLanguage;
