import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Parser from 'html-react-parser';
import { ENGLISH } from './utils/availableLocales';

const TermsAndConditions = ({ terms_and_conditions, locale })=> {
  const content = function(){
    if (locale && terms_and_conditions) {
      return Parser(terms_and_conditions[locale]);
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
  locale: PropTypes.string,
  terms_and_conditions: PropTypes.shape({
    description: PropTypes.node,
    spanish_description: PropTypes.node,
  })
};

TermsAndConditions.defaultProps = {
  locale: ENGLISH,
  terms_and_conditions: {}
};

export default TermsAndConditions;
