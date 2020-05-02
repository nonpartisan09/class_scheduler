import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Parser from 'html-react-parser';

const TermsAndConditions = ({ terms_and_conditions })=> {
  const content = function(){
    if (terms_and_conditions) {
      return Parser(terms_and_conditions);
    } else {
      return null;
    }
  }();

  return (
    <div>
      <Paper zDepth={ 1 } className='paperOverride' rounded={ false }>
        <div className='termsAndConditionsContainer'>
          { content }
        </div>
      </Paper>
    </div>
  );
};

TermsAndConditions.propTypes = {
  terms_and_conditions: PropTypes.string
};

TermsAndConditions.defaultProps = {
  terms_and_conditions: ''
};

export default TermsAndConditions;
