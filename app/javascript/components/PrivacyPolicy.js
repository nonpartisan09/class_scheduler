import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Parser from 'html-react-parser';

const PrivacyPolicy = ({ privacy_policy })=> {
  const content = function(){
    if (privacy_policy) {
      return Parser(privacy_policy);
    } else {
      return null;
    }
  }();

  return (
    <div>
      <Paper className='paperOverride' rounded={ false }>
        { content }
      </Paper>
    </div>
  );
};

PrivacyPolicy.propTypes = {
  privacy_policy: PropTypes.string
};

PrivacyPolicy.defaultProps = {
  privacy_policy: ''
};

export default PrivacyPolicy;
