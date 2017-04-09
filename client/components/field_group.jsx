import React from 'react';
import { FormGroup, ControlLabel, FormControl, HelpBlock } 
	from 'react-bootstrap';
import InputErrors from './input_errors';

const FieldGroup = ({ id, label, help, errors, form, ...props }) => {
  return (
    <FormGroup controlId={id}>
      <ControlLabel>{label}</ControlLabel>
      <InputErrors form={form} errors={errors} />
      <FormControl {...props} />
      {help && <HelpBlock>{help}</HelpBlock>}
    </FormGroup>
  );
};

export default FieldGroup;
