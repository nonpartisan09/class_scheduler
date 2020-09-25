import React, { Component } from 'react';
import PropTypes from 'prop-types';

import AutoComplete from 'material-ui/AutoComplete';

class InputAutoComplete extends Component {
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
      return item.startsWith(input);
    });

    return partialMatchFound || emptyString;
  }

  render() {
    const { hintText, dataOptions, isDisabled } = this.props;

    return (
      <div style={ { width: '3em' } }> 
        <AutoComplete
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

InputAutoComplete.propTypes = {
  dataOptions: PropTypes.array,
  onChange: PropTypes.func,
  isDisabled: PropTypes.bool,
  hintText: PropTypes.string.isRequired
};

InputAutoComplete.defaultProps = {
  dataOptions: [],
  onChange: () => {},
  isDisabled: false,
};

export default InputAutoComplete;