import React, { Component } from 'react';
import PropTypes from 'prop-types';

import AutoComplete from 'material-ui/AutoComplete';

class NumberAutoComplete extends Component {
  
  updateInputValue = (newInput) => {
    const { onChange } = this.props;
    onChange(newInput);
  };

  // is called when user updates the textfield
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
  };

  // is called when user hits enter or selects a list item
  handleNewRequest = (input) => {
    const exactMatch = this.getExactMatch(input);
    exactMatch ? this.updateInputValue(exactMatch) : this.updateInputValue(input);
  };

  getExactMatch = (input) => {
    const { dataOptions } = this.props;
    return dataOptions.find(item => Number(item) === Number(input));
  };

  setTextToExactMatch = () => {
    const { value } = this.props;
    this.handleNewRequest(value);
  };

  render() {
    const {value,  hintText, dataOptions, disabled } = this.props;

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
          onBlur={ this.setTextToExactMatch }
          openOnFocus
          fullWidth    
          disabled={ disabled }
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
  disabled: PropTypes.bool,
};

NumberAutoComplete.defaultProps = {
  dataOptions: [],
  onChange: () => {},
  value: '',
  disabled: false,
};

export default NumberAutoComplete;