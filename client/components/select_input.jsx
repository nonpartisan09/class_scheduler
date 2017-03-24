import React from 'react'

const SelectInput = ({title, onChange, value, options}) => {
	const opts = options.map( (o, i) => {
		return (
			<option 
				key={`${title}-select-${value}-${i}`}
				value={o.value}>
				{o.label}
			</option>
		);
	})

	return (
	  <select value={value} onChange={onChange}>
	  	{ opts }
	  </select>
	)

};

export default SelectInput