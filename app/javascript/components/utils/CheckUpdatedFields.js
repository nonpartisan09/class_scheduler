import _ from 'lodash';

function newUser(currentUser, oldUser, ignoredFields={ }) {
  return _.reduce(currentUser, (memo, value, key) => {
    const hasFieldChanged = value !== oldUser[key] && !_.includes(ignoredFields, key);
    const isArrayChanged = _.isArray(value) && _.isEqual(value.sort(), oldUser[key].sort()) && !_.includes(ignoredFields, key);

    if (hasFieldChanged || isArrayChanged) {
      memo[key] = value;
    }

    return memo;
  }, {});
}

export default newUser;
