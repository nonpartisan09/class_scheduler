import _ from 'lodash';
import Availability from './Availability';

function getTime(timestamp) {
  const minutes = function(){
    const getMinutes = timestamp.getMinutes().toString();
    if(getMinutes.length === 1) {
      return '0' + getMinutes;
    } else {
      return getMinutes;
    }
  }();
  return `${timestamp.getHours()}:${minutes}`;
}

function SearchUrl({ day, program, language, start_time, end_time, distance, order, page, locale }) {
  const startParam = Availability.timeIsValid(start_time) ? `&start_time=${Availability.getTimeString(start_time)}` : '';
  const endParam = Availability.timeIsValid(end_time) ? `&end_time=${Availability.getTimeString(end_time)}`: '';
  const dayParam = _.size(day) > 0 ? `&day=${day}` : '';
  const programParam = _.size(program) > 0 ? `program=${program}` : '';
  const languageParam = _.size(language) > 0 ? `&language=${language}` : '';
  const distanceParam = distance > 0 ? `&distance=${distance}` : '';
  const orderParam = order ? `&order=${order}` : '';
  const pageParam = page ? `&page=${page}` : '';
  const localeParam = locale ? `/${locale}` : '';

  return `${localeParam}/results?${programParam}${languageParam}${dayParam}${startParam}${endParam}${distanceParam}${orderParam}${pageParam}`;
}

export default SearchUrl;
