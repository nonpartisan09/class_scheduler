import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';



class DaysMultipleSelect extends Component {
  constructor(props) {
    super(props);

    this.selectionRendererDay = this.selectionRendererDay.bind(this);
    this.handleDaysSelection = this.handleDaysSelection.bind(this);
  }

  handleDaysSelection = (event) => {
    const { onChange } = this.props;
    onChange(event.target.value);    
  }

  selectionRendererDay(values) {
    const { days } = this.props;
    const allDays =  days;

    if (_.size(values) > 1) {
      return _.trimEnd(_.map(values, (value) => {
        return allDays[value];
      }).join(', '), ', '); 
    } else if (_.size(values) === 1) {
      return allDays[values];
    }
  }

render() {
    const { selectedDays } = this.props;

    return (
      <FormControl>
        <InputLabel>
          <FormattedMessage
            id='SearchBar.days'
            defaultMessage='Day(s)'
          />
        </InputLabel>
        <Select
          className="userFormInputField"
          value={ selectedDays }
          onChange={ this.handleDaysSelection }
          multiple
          renderValue={ this.selectionRendererDay }
          fullWidth
      >
          { this.getDaysMenuItems() }
        </Select>
      </FormControl>
    );
  }

  getDaysMenuItems = () => {
    const { days, selectedDays } = this.props;
   
    return (
      _.map(days, (day, index) => (
        <MenuItem 
          key={ day + index }  
          value={ index }  
        >
          <Checkbox checked={ _.indexOf(selectedDays, index) > -1  } />
          <ListItemText primary={ day } />
        </MenuItem>
      ))
    );
  }
}

DaysMultipleSelect.propTypes = {
  days: PropTypes.array.isRequired,
  selectedDays: PropTypes.array,
  errors: PropTypes.shape({
    days: PropTypes.string
  }),
  onChange: PropTypes.func,  
};

DaysMultipleSelect.defaultProps = {
  selectedDays: [],
  errors: {
    days: ''
  },
  onChange: () => {},
};

export default DaysMultipleSelect;