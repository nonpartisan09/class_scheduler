import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';

import TimeSelector from './TimeSelector';
import DaysMultipleSelect from './DaysMultipleSelect';

import getTimesValuesList from './utils/getTimeValuesList';

const EARLIEST_TIME = {
  hour: '00',
  minute: '00'
};
const LATEST_TIME = {
  hour: '23',
  minute: '59'
};

class AvailabilitySelector extends Component {
  constructor(props) {
    super(props);

    const hoursList = getTimesValuesList(Number(EARLIEST_TIME.hour), Number(LATEST_TIME.hour));
    const minutesList = getTimesValuesList(Number(EARLIEST_TIME.minute), Number(LATEST_TIME.minute));
    const isAllDay = props.isAllDay;

    this.state = {
      isAllDay: isAllDay,
      hoursList: hoursList,
      minutesList: minutesList,
    };

    if (isAllDay) {
      this.setAllDay();
    }
  
  }
  
  handleAllDayChange = (event, isAllDay ) => {
    this.setState({
        isAllDay: isAllDay,
    });

    if(isAllDay) {
      this.setAllDay();
    }
  }

  setAllDay = () => {
    const { selectedDays } = this.props;
    this.notifyChangeHandler(selectedDays, EARLIEST_TIME, LATEST_TIME);
  }

  updateStartTimeHandler = (startTimeStr) => {
    const { selectedDays, endTime} = this.props;
    const startTimeArr = startTimeStr.split(':');
    const startTime = {hour: startTimeArr[0], minute: startTimeArr[1]};
    this.notifyChangeHandler(selectedDays, startTime, endTime);
  }

  updateEndTimeHandler = (endTimeStr) => {
    const { startTime, selectedDays} = this.props;
    const endTimeArr = endTimeStr.split(':');
    const endTime = {hour: endTimeArr[0], minute: endTimeArr[1]};
    this.notifyChangeHandler(selectedDays, startTime, endTime);
  }
  updateDaysHandler = (days) => {
    const { startTime, endTime} = this.props;
    this.notifyChangeHandler(days, startTime, endTime);
  }

  notifyChangeHandler = (days, start, end) => {
    const { onChange } = this.props;
    const availability = {
      days: days,
      startTime: start,
      endTime: end,
    };
    onChange(availability);
  }
 
  render() {
    const { days, selectedDays, startTime, endTime, className } = this.props;
    const { hoursList, minutesList, isAllDay } = this.state;
    const defaultCSSClass = 'availabilitySelectorContainer';
    const classes = className ? `${defaultCSSClass} ${className}` : defaultCSSClass; 
    return (
      <div className={ classes }>
        <DaysMultipleSelect 
          days={ days } 
          selectedDays={ selectedDays }
          onChange={ this.updateDaysHandler }
        />

        <div>
          <FormControlLabel
            control={ (
              <TextField
                id="time"
                onChange={ (event) => this.updateStartTimeHandler(event.target.value) }
                type="time"
                defaultValue="07:30"
                disabled={ isAllDay }
                inputProps={ {
                  step: 300, // 5 min
                } }
              />
            ) }
            label={ (
              <FormattedMessage
                id='AvailabilitySelector.startLabel'
                defaultMessage='From'
              />
            ) }
            classes={ {root: 'timePickerLabel', label: 'timePickerLabel'} }
            labelPlacement='start'
          />
          
          <FormControlLabel
            control={ (
              <TextField
                id="time"
                onChange={ (event) => this.updateEndTimeHandler(event.target.value) }
                type="time"
                defaultValue="07:30"
                disabled={ isAllDay }
                inputProps={ {
                  step: 300, // 5 min
                } }
              />
            ) }
            label={ (
              <FormattedMessage
                id='AvailabilitySelector.endLabel'
                defaultMessage='To'
              />
            ) }
            classes={ {root: 'timePickerLabel', label: 'timePickerLabel'} }
            labelPlacement='start'
          />
          {/* <TimeSelector 
            hoursList={ hoursList }
            minutesList={ minutesList }
            onChange={ this.updateStartTimeHandler }
            label={ (
              <FormattedMessage
                id='AvailabilitySelector.startLabel'
                defaultMessage='From'
              />
            ) }
            disabled={ isAllDay }
            hour={ startTime.hour }
            minute={ startTime.minute }
          /> */}
          {/* <TimeSelector
            hoursList={ hoursList }
            minutesList={ minutesList }
            onChange={ this.updateEndTimeHandler }
            label={ (
              <FormattedMessage
                id='AvailabilitySelector.endLabel'
                defaultMessage='To'
              />
            ) }
            disabled={ isAllDay }
            hour={ endTime.hour }
            minute={ endTime.minute }
          /> */}
          <FormControlLabel
            control={ (
              <Checkbox
                className='test'
                checked={ this.state.isAllDay }
                onChange={ this.handleAllDayChange }
              />
            ) }
            label={ (
              <FormattedMessage
                id='AvailabilitySelector.allDay'
                defaultMessage='all day'
              />
            ) }
          />         
        </div>
      </div>
    );
  }
}

AvailabilitySelector.propTypes = {
  isAllDay: PropTypes.bool,
  days: PropTypes.array.isRequired,
  onChange: PropTypes.func,
  selectedDays: PropTypes.array,
  startTime: PropTypes.shape({
    hour: PropTypes.string,
    minute: PropTypes.string,
  }),
  endTime: PropTypes.shape({
    hour: PropTypes.string,
    minute: PropTypes.string,
  }),
  className: PropTypes.string,
};

AvailabilitySelector.defaultProps = {
  isAllDay: false,
  onChange: () => {},
  selectedDays: [],
  startTime: {
    hour:'',
    minute:'',
  },
  endTime: {
    hour:'',
    minute:'',
  },
  className: '',
};

export default AvailabilitySelector;