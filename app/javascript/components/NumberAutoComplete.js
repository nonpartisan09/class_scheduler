import React, { Component } from 'react';
import PropTypes from 'prop-types';

import AutoComplete from 'material-ui/AutoComplete';

class NumberAutoComplete extends Component {
  constructor(props) {
    super(props);

    this.state = {
      input: ''
    };
  }

  handleNewRequest = (input) => {
    this.updateInputValue(input);
  };

  handleUpdateInput = (input) => {
    if(this.isValidInput(input)) {
      this.updateInputValue(input);
    }
  };

  updateInputValue = (newInput) => {
    const { onChange } = this.props;

    this.setState({
      input: newInput,
    });

    onChange(newInput);
  }

  isValidInput = (input) => {
    const { dataOptions } = this.props;

    const emptyString = input.length === 0;

    const partialMatchFound =  dataOptions.some( item => {
      return item.includes(input);
    });

    return partialMatchFound || emptyString;
  }

  render() {
    const { hintText, dataOptions, isDisabled } = this.props;

    return (
      <div style={ { width: '4em', display: 'inline-block' } }> 
        <AutoComplete
          listStyle={ { maxHeight: 200, overflow: 'auto' } }
          inputStyle={ { textAlign: 'center' } }
          hintStyle={ { textAlign: 'center', width: '100%' } }
          hintText={ hintText }
          searchText={ this.state.input }
          onUpdateInput={ this.handleUpdateInput }
          onNewRequest={ this.handleNewRequest }
          dataSource={ dataOptions }
          filter={ AutoComplete.caseInsensitiveFilter }
          openOnFocus
          fullWidth
          disabled={ isDisabled }          
        />
      </div>
    );
  }


}

NumberAutoComplete.propTypes = {
  dataOptions: PropTypes.array,
  onChange: PropTypes.func,
  isDisabled: PropTypes.bool,
  hintText: PropTypes.string.isRequired
};

NumberAutoComplete.defaultProps = {
  dataOptions: [],
  onChange: () => {},
  isDisabled: false,
};

export default NumberAutoComplete;