import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import Checkbox from 'material-ui/Checkbox';

import TimeSelector from './TimeSelector';
import DaysMultipleSelect from './DaysMultipleSelect';

const FIRST_HOUR = '00';
const FIRST_MINUTE = '00';
const LAST_HOUR = '23';
const LAST_MINUTE = '59';

class AvailabilitySelector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAllDay: props.isAllDay,
      startTime: {
        hour: '',
        minute: '',
      },
      endTime: {
        hour: '',
        minute: '',
      },
      day: [],
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
    this.setState({
        isAllDay: isAllDay,
    });

    if (isAllDay) {
      const starTime = {
        hour: FIRST_HOUR,
        minute: FIRST_MINUTE,
      };

      const endTime = {
        hour: LAST_HOUR,
        minute: LAST_MINUTE,
      };

      this.updateStartTimeHandler(starTime);
      this.updateEndTimeHandler(endTime);

    }
  }

  updateStartTimeHandler = (startTime) => {
    console.log("The new start time is: ");
    console.log(startTime);

    this.setState({
      startTime: startTime,
    });
  }

  updateEndTimeHandler = (endTime) => {
    this.setState({
      endTime: endTime,
    });
  }

  render() {
    const { days } = this.props;

    const hours = this.getTimes(24);
    const minutes = this.getTimes(60);

    const { startTime, endTime, isAllDay } = this.state;

    return (
      <div>
        <DaysMultipleSelect days={ days } />

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
            hoursList={ hours }
            minutesList={ minutes }
            onChange={ this.updateEndTimeHandler }
            labelText=" To "
            disabled={ isAllDay }
            hour={ endTime.hour }
            minute={ endTime.minute }
          />
          <Checkbox
            style={ {paddingLeft: '2em'} }
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

};

AvailabilitySelector.defaultProps = {
  isAllDay: false,
};

export default AvailabilitySelector;