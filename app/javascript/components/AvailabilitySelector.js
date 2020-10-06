import React, { Component } from 'react';
import PropTypes from 'prop-types';


import Checkbox from 'material-ui/Checkbox';

import TimeSelector from './TimeSelector';

class AvailabilitySelector extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }
  getTimes = (max) => {
    const list = new Array(max);

    for (let i = 1; i < max; i++) {
      if( i < 10)
        list[i - 1] = '0' + i + '';  
      else
        list[i - 1] = '' + i + '';
    }

    console.log("getTimes");
    console.log(list);
    return list;
  }

  handleAllDayChange = (event, isChecked) => {
    // TODO
    // if checked: set start = 00, end = 00, and disable the TimeSelectors
    // if not checked: enable the TimeSelectors
    console.log("Is all day: " + isChecked);
  }

  render() {
    // const { errors, search: { day }, days } = this.props;
    
    const hours = this.getTimes(24);
    const minutes = this.getTimes(60);

    return (
      <div style={ {display: 'flex', alignItems: 'center'} }>
        <TimeSelector 
          hoursList={ hours }
          minutesList={ minutes }
          onChange={ this.inputChangeHandler }
          labelText=" From "
          
        />
        <TimeSelector 
          hoursList={ hours }
          minutesList={ minutes }
          onChange={ this.inputChangeHandler }
          labelText=" To "
        />
        <Checkbox
          style={ {paddingLeft: '2em'} }
          label="All Day"
          onCheck={ this.handleAllDayChange }
        />
      </div>
    );
  }
}

AvailabilitySelector.propTypes = {

};

AvailabilitySelector.defaultProps = {

};

export default AvailabilitySelector;