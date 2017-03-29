import React from 'react'

const TextInput = ({type, onChange, value}) => React.createElement(
	type === "textarea" ? "textarea" : "input", 
	{type, onChange, value}
)

export default TextInput