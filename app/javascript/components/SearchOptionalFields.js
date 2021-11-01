import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TimePicker } from '@material-ui/pickers';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import { FormattedMessage } from 'react-intl';

const UNIT = 'miles';

class SearchOptionalFields extends Component {
  constructor(props) {
    super(props);

    this.changeHandlerDistance = this.changeHandlerDistance.bind(this);
    this.handleToggleStartTime = this.handleToggleStartTime.bind(this);
    this.handleToggleEndTime = this.handleToggleEndTime.bind(this);
    this.handleToggleDistance = this.handleToggleDistance.bind(this);
    this.selectionRendererDistance = this.selectionRendererDistance.bind(this);


    this.state = {
      showStartTime: false,
      showEndTime: false,
      showDistance: false
    };
  }
  render() {
    return (
      <div className='searchBarOptionalFieldContainer'>
        { this.renderDistanceButton() }

        { this.renderDistance() }
      </div>
    );
  }

  renderDistanceButton() {
    const { city } = this.props;

    if (city) {
      return (
        <div className='searchBarDistanceButton'>
          <Button
            color='primary'
            onClick={ this.handleToggleDistance }
          >
            <FormattedMessage
              id='searchOptionalFields.distance'
              defaultMessage='Distance'
            />
          </Button>
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
          ampm={ false }
          format='24hr'
          hintText={  <FormattedMessage id='from' /> }
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
          hintText={ <FormattedMessage id='to' /> }
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
        <FormControl fullWidth error={ errors.distance !== undefined }>
          <Select
            className='searchBarDistanceOption'
            value={ distance }
            onChange={ this.changeHandlerDistance }
            renderValue={ this.selectionRendererDistance }
          >
            <MenuItem
              key={ 0 }
              value={ 0 }
          >
              <Checkbox checked={ distance === 0 } />
              <ListItemText primary={ (
                <FormattedMessage
                  id='SearchOptionalFields.any'
                  defaultMessage='Any'
              />
            ) } />
            </MenuItem>
            <MenuItem key={ 1 } value={ 5 }>
              <Checkbox checked={ distance === 5 } />
              <ListItemText primary={ `5 ${UNIT}` } />
            </MenuItem>
            <MenuItem key={ 2 } value={ 10 }>
              <Checkbox checked={ distance === 10 } />
              <ListItemText primary={ `10 ${UNIT}` } />
            </MenuItem>
            <MenuItem key={ 3 } value={ 25 }>
              <Checkbox checked={ distance === 25 } />
              <ListItemText primary={ `25 ${UNIT}` } />
            </MenuItem>
            <MenuItem key={ 4 } value={ 50 }>
              <Checkbox checked={ distance === 50 } />
              <ListItemText primary={ `50 ${UNIT}` } />
            </MenuItem>
            <MenuItem key={ 5 } value={ 100 }>
              <Checkbox checked={ distance === 100 } />
              <ListItemText primary={ `100 ${UNIT}` } />
            </MenuItem>
          </Select>
          <FormHelperText>{ errors.distance }</FormHelperText>
        </FormControl>
      );
    }
  }

  selectionRendererDistance(value) {
    if (value === 0) {
      return 'Any';
    } else {
      return `${value} ${UNIT}`;
    }
  }

  changeHandlerDistance(event) {
    const { changeValue } = this.props;
    changeValue('distance', event.target.value, { validate: true });
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
