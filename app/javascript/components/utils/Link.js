function formatLink(link, locale='') {
  if (locale && link) {
    return `/${locale}${link}`;
  } else if (link) {
    return `/en${link}`;
  }
}

export default formatLink;
