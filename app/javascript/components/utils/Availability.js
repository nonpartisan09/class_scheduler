class Availability {
  static getDefaultAvailability() {
    const defaultAvailability = {
      startTime: { minute: '', hour: '' },
      endTime: { minute: '', hour: '' },
      days: [],
    };
    return defaultAvailability;
  }
  static getHourPattern() {
    return /^[0-2][0-9]$/;
  }
  static getMinutePattern() {
    return /^[0-5][0-9]$/;
  }
  static timeIsValid(time) {
    return time && this.hourIsValid(time.hour) && this.minuteIsValid(time.minute);
  }
  static hourIsValid(hour) {
    if(typeof hour !== 'string' || !hour.match(this.getHourPattern())) {
      return false;
    }
    const value = Number(hour);
    return value >= 0 && value <= 23;
  }
  static minuteIsValid(minute) {
    if(typeof minute !== 'string' || !minute.match(this.getMinutePattern())) {
      return false;
    }
    const value = Number(minute);
    return value >= 0 && value <= 59;
  }

  static timesAreIdentical(startTime, endTime) {
    const date = new Date();
    const startDate = this.getDate(date, startTime);
    const endDate = this.getDate(date, endTime);

    return startDate.valueOf() === endDate.valueOf();
  }
  static endTimeIsBeforeStartTime(startTime, endTime) {
    const date = new Date();
    const startDate = this.getDate(date, startTime);
    const endDate = this.getDate(date, endTime);

    return endDate < startDate;
  }

  static getDate(date, time) {
    const newDate = new Date(date.getTime());
    newDate.setHours(time.hour);
    newDate.setMinutes(time.minute);
    return newDate;
  }
    
}

export default Availability;