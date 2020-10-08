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
    const { labelText, hoursList, minutesList, errorText } = this.props;
    const { disabled, hour, minute } = this.props;

    return (
      <div style={ {display:'inline-block'} }>
        <div style={ {display: 'flex', alignItems: 'center'} }>
          <span style={ {fontSize:'1.2em'} }>{ labelText }</span>
          <NumberAutoComplete 
            dataOptions={ hoursList } 
            hintText={ HINT_TEXT_HOURS }
            onChange={ this.handleHourChange }
            disabled={ disabled }
            value={ hour }
          />
          <span style={ {fontWeight: 'bold', fontSize: '1.3em'} }>:</span>
          <NumberAutoComplete 
            dataOptions={ minutesList } 
            hintText={ HINT_TEXT_MINUTES }
            onChange={ this.handleMinuteChange }
            disabled={ disabled }
            value={ minute }
          />
          <br />
          <span>{ errorText }</span>
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
  labelText: PropTypes.string.isRequired,
  errorText: PropTypes.string,
  hour: PropTypes.string,
  minute: PropTypes.string,
};

TimeSelector.defaultProps = {
  hoursList: [],
  minutesList: [],
  onChange: () => {},
  disabled: false,
  errorText: '',
  hour: '',
  minute: ''
};

export default TimeSelector;