import React from 'react'

const TextInput = ({onChange, type, label, placeholder, value}) => (
	<input 
		onChange={onChange} 
		type={type} 
		name={label} 
		placeholder={placeholder} 
		value={value}
	/>
);

export default TextInput