import React from 'react'

const InputErrors = ({label, errors}) => {
	if (!errors || errors.length < 1) return null;
	const items = errors.map((e,i) => <li key={`${label}-${e}`}>{e}</li>)
	return <ul className="input-errors">{items}</ul>
}

export default InputErrors;