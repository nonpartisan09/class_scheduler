import React from 'react';
import { Alert } from 'react-bootstrap';
import { connect } from 'react-redux';

const Notice = ({message, category}) => (
	<Alert bsStyle={category} className="notice">{message}</Alert>
);

export default Notice;