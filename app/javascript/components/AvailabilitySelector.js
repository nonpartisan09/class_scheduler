import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import Checkbox from 'material-ui/Checkbox';

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

    this.state = {
      isAllDay: props.isAllDay,
      hoursList: hoursList,
      minutesList: minutesList,
    };
  
  }
  
  handleAllDayChange = (event, isAllDay ) => {
    const { selectedDays } = this.props;
    this.setState({
        isAllDay: isAllDay,
    });
    this.notifyChangeHandler(selectedDays, EARLIEST_TIME, LATEST_TIME);
  }

  updateStartTimeHandler = (startTime) => {
    const { selectedDays, endTime} = this.props;
    this.notifyChangeHandler(selectedDays, startTime, endTime);
  }

  updateEndTimeHandler = (endTime) => {
    const { startTime, selectedDays} = this.props;
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
    const { days, selectedDays, startTime, endTime } = this.props;
    const { hoursList, minutesList } = this.state;
    const { isAllDay } = this.state;

    return (
      <div style={ { width: '100%', textAlign: 'left' } }>
        <DaysMultipleSelect 
          days={ days } 
          selectedDays={ selectedDays }
          onChange={ this.updateDaysHandler }
        />

        <div style={ {display: 'flex', alignItems: 'center'} }>
          <TimeSelector 
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
          />
          <TimeSelector
            style={ {paddingLeft: '1em'} }
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
          />
          <Checkbox
            style={ {paddingLeft: '2em', textAlign: 'left' } }
            checked={ this.state.isAllDay }
            label={ (
              <FormattedMessage
                id='AvailabilitySelector.allDay'
                defaultMessage='all day'
              />
            ) }
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
  startTime: {
    hour:'',
    minute:'',
  },
  endTime: {
    hour:'',
    minute:'',
  },
};

export default AvailabilitySelector;