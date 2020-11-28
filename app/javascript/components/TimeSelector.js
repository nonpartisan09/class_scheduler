import React, { Component } from 'react';
import PropTypes from 'prop-types';

import NumberAutoComplete from './NumberAutoComplete';

const HINT_TEXT_HOURS = 'HH';
const HINT_TEXT_MINUTES = 'MM';

class TimeSelector extends Component {

  handleHourChange = (newHour) => {
    const { onChange, minute } =  this.props;
    onChange(this.getTimeObject(newHour, minute));
  }

  handleMinuteChange = (newMinutes) => {
    const { onChange, hour } =  this.props;
    onChange(this.getTimeObject(hour, newMinutes));
  }

  getTimeObject = (hour, minute) => {
    return {
      hour: hour,
      minute: minute,
    };
  }

  render() {
    const { label, hoursList, minutesList } = this.props;
    const { disabled, hour, minute, style } = this.props;
 
    return (
      <div className='time-selector-container' style={ {...style } }>
        <div>
          <p>{ label }</p>
          <NumberAutoComplete 
            dataOptions={ hoursList } 
            hintText={ HINT_TEXT_HOURS }
            onChange={ this.handleHourChange }
            disabled={ disabled }
            value={ hour }
          />
          <span>:</span>
          <NumberAutoComplete 
            dataOptions={ minutesList } 
            hintText={ HINT_TEXT_MINUTES }
            onChange={ this.handleMinuteChange }
            disabled={ disabled }
            value={ minute }
          />
        </div>
      </div>
    );
  }
}

TimeSelector.propTypes = {
  hoursList: PropTypes.array,
  minutesList: PropTypes.array,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  label: PropTypes.object.isRequired,
  hour: PropTypes.string,
  minute: PropTypes.string,
  style: PropTypes.object,
};

TimeSelector.defaultProps = {
  hoursList: [],
  minutesList: [],
  onChange: () => {},
  disabled: false,
  hour: '',
  minute: '',
  style: {},
};

export default TimeSelector;