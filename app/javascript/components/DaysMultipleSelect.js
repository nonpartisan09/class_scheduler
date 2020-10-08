import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';



class DaysMultipleSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      day: []
    };
  }

changeHandlerDay = (event, index, values) => {
    this.setState({
      day: values
    });
  }

  handleChange = (event, index, values) => this.setState({values});

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

  getDaysMenuItems = () => {
    const { days } = this.props;
    const { day } = this.state;
    
    return (
      _.map(days, (value, index) => (
        <MenuItem 
          key={ value + index } 
          insetChildren 
          checked={ _.indexOf(day, index) > -1 } 
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

render() {
    const { errors } = this.props;
    const { day } = this.state;

    return (
      <SelectField
        hintText={ (
          <FormattedMessage
            id='SearchBar.days'
            defaultMessage='Day(s)'
          />
        ) }
        value={ day }
        errorText={ errors.days }
        onChange={ this.changeHandlerDay }
        multiple
        selectionRenderer={ this.selectionRendererDay }
        fullWidth
      >
        { this.getDaysMenuItems() }
      </SelectField>
    );
  }
}

DaysMultipleSelect.propTypes = {
  days: PropTypes.array,
  errors: PropTypes.shape({
    days: PropTypes.string
  })  
};

DaysMultipleSelect.defaultProps = {
  days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  errors: {
    days: ''
  },
};

export default DaysMultipleSelect;