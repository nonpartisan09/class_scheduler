import React from 'react';
import PropTypes from 'prop-types';

const ErrorField = ({ error })=> {
   if (error) {
     return (
       <div className='errorField'>
         { error }
       </div>
     );
   } else {
     return null;
   }
};

ErrorField.propTypes = {
  error: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
};

ErrorField.defaultProps = {
  error: '',
};

export default ErrorField;
