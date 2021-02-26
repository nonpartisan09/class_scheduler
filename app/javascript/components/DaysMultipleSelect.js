import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';



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
    if (_.size(values) > 1) {
      return values.join(', ');
    } else if (_.size(values) === 1) {
      return values.toString();
    }
  }

render() {
    const { errors, selectedDays } = this.props;

    return (
      <Select
        // hintText={ (
        //   <FormattedMessage
        //     id='SearchBar.days'
        //     defaultMessage='Day(s)'
        //   />
        // ) }
        value={ selectedDays }
        // errorText={ errors.days }
        onChange={ this.handleDaysSelection }
        multiple
        renderValue={ this.selectionRendererDay }
        fullWidth
      >
        { this.getDaysMenuItems() }
      </Select>
    );
  }

  getDaysMenuItems = () => {
    const { days, selectedDays } = this.props;
   
    return (
      _.map(days, (day, index) => (
        <MenuItem 
          key={ day + index }  
          value={ day }  
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