import React from 'react';

const InputErrors = ({ form, errors }) => {
	if (!errors || errors.length < 1) return null;
	const items = errors.map(e => <li key={`${form}-${e}`}>{e}</li>);
	return <ul className="input-errors">{items}</ul>;
};

export default InputErrors;
