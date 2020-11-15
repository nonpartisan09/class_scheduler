import React, { Component } from 'react';
import PropTypes from 'prop-types';

import AutoComplete from 'material-ui/AutoComplete';

class NumberAutoComplete extends Component {

  handleNewRequest = (input) => {
    this.updateInputValue(input);
  };

  handleUpdateInput = (input) => {
    if(this.isValidInput(input)) {
      this.updateInputValue(input);
    }
  };
  isValidInput = (input) => {
    const { dataOptions } = this.props;
    const emptyString = input.length === 0;
    const partialMatchFound =  dataOptions.some( item => {
      return item.includes(input);
    });

    return partialMatchFound || emptyString;
  }
  
  updateInputValue = (newInput) => {
    const { onChange } = this.props;
    onChange(newInput);
  }

  render() {
    const {value,  hintText, dataOptions } = this.props;

    return (
      <div style={ { width: '4em', display: 'inline-block' } }> 
        <AutoComplete
          listStyle={ { maxHeight: 200, overflow: 'auto' } }
          inputStyle={ { textAlign: 'center' } }
          hintStyle={ { textAlign: 'center', width: '100%' } }
          hintText={ hintText }
          searchText={ value }
          onUpdateInput={ this.handleUpdateInput }
          onNewRequest={ this.handleNewRequest }
          dataSource={ dataOptions }
          filter={ AutoComplete.noFilter }
          openOnFocus
          fullWidth    
        />
      </div>
    );
  }
}

NumberAutoComplete.propTypes = {
  dataOptions: PropTypes.array,
  onChange: PropTypes.func,
  hintText: PropTypes.string.isRequired,
  value: PropTypes.string,
};

NumberAutoComplete.defaultProps = {
  dataOptions: [],
  onChange: () => {},
  value: '',
};

export default NumberAutoComplete;