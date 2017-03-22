import React from 'react'

const InputErrors = ({errors, onError, validate}) => {
	if (!errors || errors.length < 1) return null;
	const items = errors.map((e,i) => <li key={e}>{e}</li>)
	return <ul>{items}</ul>
}

export default InputErrors;