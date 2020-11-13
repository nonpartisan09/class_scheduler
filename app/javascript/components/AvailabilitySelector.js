import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Checkbox from 'material-ui/Checkbox';

import TimeSelector from './TimeSelector';
import DaysMultipleSelect from './DaysMultipleSelect';

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

    this.state = {
      isAllDay: props.isAllDay,
      startTime: props.startTime,
      endTime: props.endTime,
      selectedDays: props.selectedDays
    };
  
  }
  
  getTimes = (max) => {
    const list = new Array(max);

    for (let i = 0; i < max; i++) {
      if( i < 10)
        list[i] = '0' + i + '';  
      else
        list[i] = '' + i + '';
    }
    return list;
  }

  handleAllDayChange = (event, isAllDay ) => {
    const { selectedDays } = this.state;
    this.setState({
        isAllDay: isAllDay,
    });

    if (isAllDay) {
      this.setState({
        startTime: EARLIEST_TIME,
      });
      this.setState({
        endTime: LATEST_TIME,
      });

      this.notifyChangeHandler(selectedDays, EARLIEST_TIME, LATEST_TIME);
    }
  }

  updateStartTimeHandler = (startTime) => {
    const { selectedDays, endTime} = this.state;

    this.setState({
      startTime: startTime,
    });

    this.notifyChangeHandler(selectedDays, startTime, endTime);
  }

  updateEndTimeHandler = (endTime) => {
    const { startTime, selectedDays} = this.state;

    this.setState({
      endTime: endTime,
    });

    this.notifyChangeHandler(selectedDays, startTime, endTime);
  }
  updateDaysHandler = (days) => {
    const { startTime, endTime} = this.state;

    this.setState({
      selectedDays: days,
    });

    this.notifyChangeHandler(days, startTime, endTime);
  }

  getTimeString = (time) => {
      return time.hour + ':' + time.minute;
  }

  notifyChangeHandler = (days, start, end) => {
    const { onChange } = this.props;

    const availabilities = days.map((day) => {
      return {
        day: day,
        start_time: this.getTimeString(start),
        end_time: this.getTimeString(end),
      };
    });
    onChange(availabilities);
  }


  render() {
    const { days } = this.props;

    const hours = this.getTimes(24);
    const minutes = this.getTimes(60);

    const { startTime, endTime, isAllDay, selectedDays } = this.state;

    return (
      <div style={ { width: '100%', textAlign: 'left' } }>
        <DaysMultipleSelect 
          days={ days } 
          selectedDays={ selectedDays }
          onChange={ this.updateDaysHandler }
        />

        <div style={ {display: 'flex', alignItems: 'center'} }>
          <TimeSelector 
            hoursList={ hours }
            minutesList={ minutes }
            onChange={ this.updateStartTimeHandler }
            labelText=" From "
            disabled={ isAllDay }
            hour={ startTime.hour }
            minute={ startTime.minute }
          />
          <TimeSelector
            style={ {paddingLeft: '1em'} }
            hoursList={ hours }
            minutesList={ minutes }
            onChange={ this.updateEndTimeHandler }
            labelText=" To "
            disabled={ isAllDay }
            hour={ endTime.hour }
            minute={ endTime.minute }
          />
          <Checkbox
            style={ {paddingLeft: '2em', textAlign: 'left' } }
            checked={ this.state.isAllDay }
            label="All Day"
            onCheck={ this.handleAllDayChange }
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
};

AvailabilitySelector.defaultProps = {
  isAllDay: false,
  onChange: () => {},
  selectedDays: [],
  startTime: '',
  endTime: '',
};

export default AvailabilitySelector;