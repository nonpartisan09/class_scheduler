function isCurrentUserLocated({ state, city, country }) {
  return !!(state || city || country);
}

export default isCurrentUserLocated;
