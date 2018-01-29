import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TimePicker from 'material-ui/TimePicker';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import FlatButton from 'material-ui/FlatButton';
import { FormattedMessage } from 'react-intl';

import './SearchOptionalFields.css';

const UNIT = 'miles';

class SearchOptionalFields extends Component {
  constructor(props) {
    super(props);

    this.changeHandlerDistance = this.changeHandlerDistance.bind(this);
    this.handleToggleStartTime = this.handleToggleStartTime.bind(this);
    this.handleToggleEndTime = this.handleToggleEndTime.bind(this);
    this.handleToggleDistance = this.handleToggleDistance.bind(this);


    this.state = {
      showStartTime: false,
      showEndTime: false,
      showDistance: false
    };
  }
  render() {
    return (
      <div className='searchBarOptionalFieldContainer'>
        <div className='searchBarStartTimeButton'>
          <FlatButton
            primary
            label={ <FormattedMessage
              id='startTime'
            /> }
            onClick={ this.handleToggleStartTime }
            fullWidth
          />
        </div>

        <div className='searchBarEndTimeButton'>
          <FlatButton
            primary
            label={
              <FormattedMessage
                id='endTime'
              />
            }
            fullWidth
            onClick={ this.handleToggleEndTime }
          />
        </div>
        { this.renderDistanceButton() }

        { this.renderStartTime() }
        { this.renderEndTime() }
        { this.renderDistance() }
      </div>
    );
  }

  renderDistanceButton() {
    const { city } = this.props;

    if (city) {
      return (
        <div className='searchBarDistanceButton'>
          <FlatButton
            primary
            label={
              <FormattedMessage
                id='searchOptionalFields.distance'
                defaultMessage='Distance'
              />
            }
            onClick={ this.handleToggleDistance }
            fullWidth
          />
        </div>
      );
    }
  }

  renderStartTime() {
    const { showStartTime } = this.state;

    const {
      start_time,
      onChange,
      onBlur
    } = this.props;

    if (showStartTime) {
      return (
        <TimePicker
          className='searchBarStartTimePicker'
          format='24hr'
          hintText={
            <FormattedMessage
              id='from'
            />
          }
          value={ start_time }
          onChange={ onChange('start_time') }
          onBlur={ onBlur('start_time') }
        />
      );
    }
  }

  renderEndTime() {
    const {
      end_time,
      onChange,
      onBlur
    } = this.props;

    const { showEndTime } = this.state;

    if (showEndTime) {
      return (
        <TimePicker
          className='searchBarEndTimePicker'
          format='24hr'
          hintText={
            <FormattedMessage
              id='to'
            />
          }
          value={ end_time }
          onChange={ onChange('end_time') }
          onBlur={ onBlur('end_time') }
        />
      );
    }
  }

  handleToggleStartTime() {
    const { showStartTime } = this.state;

    this.setState({
      showStartTime: !showStartTime
    });
  }

  handleToggleEndTime() {
    const { showEndTime } = this.state;

    this.setState({
      showEndTime: !showEndTime
    });
  }

  handleToggleDistance() {
    const { showDistance } = this.state;

    this.setState({
      showDistance: !showDistance
    });
  }

  renderDistance() {
    const {
      errors,
      distance
    } = this.props;

    const { showDistance } = this.state;
    if (showDistance) {
      return (
        <SelectField
          className='searchBarDistanceOption'
          value={ distance }
          errorText={ errors.distance }
          onChange={ this.changeHandlerDistance }
        >
          <MenuItem
            insetChildren
            checked={ distance === 0 }
            key={ 0 }
            value={ 0 }
            primaryText={
              <FormattedMessage
                id='SearchOptionalFields.any'
                defaultMessage='Any'
              />
            }
          />
          <MenuItem insetChildren checked={ distance === 5 } key={ 1 } value={ 5 } primaryText={ `5 ${UNIT}` } />
          <MenuItem insetChildren checked={ distance === 10 } key={ 2 } value={ 10 } primaryText={ `10 ${UNIT}` } />
          <MenuItem insetChildren checked={ distance === 25 } key={ 3 } value={ 25 } primaryText={ `25 ${UNIT}` } />
          <MenuItem insetChildren checked={ distance === 50 } key={ 4 } value={ 50 } primaryText={ `50 ${UNIT}` } />
          <MenuItem insetChildren checked={ distance === 100 } key={ 5 } value={ 100 } primaryText={ `100 ${UNIT}` } />
        </SelectField>
      );
    }
  }

  changeHandlerDistance(event, index, value) {
    const { changeValue } = this.props;
    changeValue('distance', value, { validate: true });
  }

}

SearchOptionalFields.propTypes = {
  city: PropTypes.string,
  distance: PropTypes.number,
  start_time: PropTypes.instanceOf(Date),
  end_time: PropTypes.instanceOf(Date),
  changeValue: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  errors: PropTypes.object
};

SearchOptionalFields.defaultProps = {
  city: '',
  distance: 0,
  start_time: null,
  end_time: null,
  errors: { }
};

export default SearchOptionalFields;
