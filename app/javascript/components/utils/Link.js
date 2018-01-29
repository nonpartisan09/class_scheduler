import { ENGLISH, SPANISH } from './availableLocales';

function formatLink(link, locale='') {
  const guestLocale = localStorage.getItem('locale');
  const localePattern = new RegExp(`(${ENGLISH}|${SPANISH})`);
  const isGuestLocaleAsExpected = localePattern.test(guestLocale);

  if (link && locale) {
    return `/${locale}${link}`;
  } else if (link && guestLocale && isGuestLocaleAsExpected) {
    return `/${guestLocale}${link}`;
  } else if (link) {
    return `/en${link}`;
  }
}

export default formatLink;
