
const TIME_FORMAT_PREF = 'timeFormatPreference';
const TWELVE_HOUR_FORMAT = '12-hour';
const TWENTY_FOUR_HOUR_FORMAT = '24-hour';

class AvailabilityTimeFormatPrefs {
  static set12HourPref() {
    localStorage.setItem(TIME_FORMAT_PREF,TWELVE_HOUR_FORMAT); 
  }
  static set24HourPref() {
    localStorage.setItem(TIME_FORMAT_PREF,TWENTY_FOUR_HOUR_FORMAT); 
  }

  static use12HourFormat() {
    return !(localStorage.getItem(TIME_FORMAT_PREF) === TWENTY_FOUR_HOUR_FORMAT);
  }    

  static toggleTimePref(using12Hour) {
    if(using12Hour) {
      AvailabilityTimeFormatPrefs.set24HourPref();
    }else {
      AvailabilityTimeFormatPrefs.set12HourPref();
    }
  }
}

export default AvailabilityTimeFormatPrefs;