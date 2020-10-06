import React, { Component } from 'react';
import PropTypes from 'prop-types';

import NumberAutoComplete from './NumberAutoComplete';

const HINT_TEXT_HOURS = 'HH';
const HINT_TEXT_MINUTES = 'MM';

class TimeSelector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hour: '',
      minute: ''
    };
  }

  handleHourChange = (newHour) => {
    const { minute } = this.state;
    const { onChange } =  this.props;

    this.setState({
      hour: newHour
    });

    onChange(this.getTimeString(newHour, minute));
  }
  handleMinuteChange = (newMinutes) => {
    const { hour } = this.state;
    const { onChange } =  this.props;

    this.setState({
      minute: newMinutes
    });

    onChange(this.getTimeString(hour, newMinutes));
  }


  //TODO put in its own class in utilities
  getTimeString = (hour, minute) => {
    return hour + ':' + minute;
  }


  render() {
    const { labelText, hoursList, minutesList, hoursIsDisabled, minutesIsDisabled, errorText } = this.props;
    return (
      <div style={ {display:'inline-block'} }>
        <div style={ {display: 'flex', alignItems: 'center'} }>
          <span style={ {fontSize:'1.2em'} }>{ labelText }</span>
          <NumberAutoComplete 
            dataOptions={ hoursList } 
            hintText={ HINT_TEXT_HOURS }
            onChange={ this.handleHourChange }
            disabled={ hoursIsDisabled }
          />
          <span style={ {fontWeight: 'bold', fontSize: '1.3em'} }>:</span>
          <NumberAutoComplete 
            dataOptions={ minutesList } 
            hintText={ HINT_TEXT_MINUTES }
            onChange={ this.handleMinuteChange }
            disabled={ minutesIsDisabled }
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
  onChange: PropTypes.func,
  hoursIsDisabled: PropTypes.bool,
  minutesIsDisabled: PropTypes.bool,
  labelText: PropTypes.string.isRequired,
  errorText: PropTypes.string,
};

TimeSelector.defaultProps = {
  hoursList: [],
  minutesList: [],
  onChange: () => {},
  hoursIsDisabled: false,
  minutesIsDisabled: false,
  errorText: '',
};

export default TimeSelector;