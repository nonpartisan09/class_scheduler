import moment from 'moment/moment';
import _ from 'lodash';

function SearchUrl({ day, program, start_time, end_time, distance, order, page, locale }) {
  const startParam = _.isDate(start_time)? `&start_time=${moment(start_time).format('HH:MM')}` : '';
  const endParam = _.isDate(end_time)? `&end_time=${moment(end_time).format('HH:MM')}`: '';
  const dayParam = _.size(day) > 0? `&day=${day}` : '';
  const programParam = _.size(program) > 0? `program=${program}` : '';
  const distanceParam = distance > 0? `&distance=${distance}` : '';
  const orderParam = order? `&order=${order}` : '';
  const pageParam = page? `&page=${page}` : '';
  const localeParam = locale? `/${locale}` : '';

  return `${localeParam}/results?${programParam}${dayParam}${startParam}${endParam}${distanceParam}${orderParam}${pageParam}`;
}

export default SearchUrl;
