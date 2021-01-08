import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';



class DaysMultipleSelect extends Component {
  handleDaysSelection = (event, index, values) => {
    const { onChange } = this.props;
    onChange(values);    
  }

  selectionRendererDay = (values) => {
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
    const { errors, selectedDays } = this.props;

    return (
      <SelectField
        hintText={ (
          <FormattedMessage
            id='SearchBar.days'
            defaultMessage='Day(s)'
          />
        ) }
        value={ selectedDays }
        errorText={ errors.days }
        onChange={ this.handleDaysSelection }
        multiple
        selectionRenderer={ this.selectionRendererDay }
        fullWidth
      >
        { this.getDaysMenuItems() }
      </SelectField>
    );
  }

  getDaysMenuItems = () => {
    const { days, selectedDays } = this.props;
   
    return (
      _.map(days, (value, index) => (
        <MenuItem 
          key={ value + index } 
          insetChildren 
          checked={ _.indexOf(selectedDays, index) > -1 } 
          value={ index } 
          primaryText={ (
            <span> 
              { value } 
            </span> 
          ) } 
        />
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