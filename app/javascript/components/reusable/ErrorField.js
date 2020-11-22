import React from 'react';
import PropTypes from 'prop-types';

const renderErrorLines = (errors) => {
  return errors.map((error, index) => <p key={ index } className='errorField'>{ error }</p>);
};

const ErrorField = ({ error })=> {
   if (error) {
     const errorsSplit = error.split('\n');
     return (
       <div>
         { renderErrorLines(errorsSplit) }
       </div>
     );
   } else {
     return null;
   }
};

ErrorField.propTypes = {
  error: PropTypes.string
};

ErrorField.defaultProps = {
  error: ''
};

export default ErrorField;
