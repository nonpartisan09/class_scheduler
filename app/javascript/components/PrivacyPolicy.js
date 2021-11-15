import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Parser from 'html-react-parser';
import { ENGLISH } from './utils/availableLocales';

const PrivacyPolicy = ({ privacy_policy, locale })=> {
  const content = function(){
    if (locale && privacy_policy) {
      return Parser(privacy_policy[locale]);
    } else {
      return null;
    }
  }();

  return (
    <div>
      <Paper className='paperOverride' square>
        { content }
      </Paper>
    </div>
  );
};

PrivacyPolicy.propTypes = {
  locale: PropTypes.string,
  privacy_policy: PropTypes.shape({
    description: PropTypes.node,
    spanish_description: PropTypes.node,
  })
};

PrivacyPolicy.defaultProps = {
  locale: ENGLISH,
  privacy_policy: {}
};

export default PrivacyPolicy;
