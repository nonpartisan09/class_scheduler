import React from 'react'
import validate from '../utils/validate'
import InputErrors from './input_errors'
import TextInput from './text_input'
import SelectInput from './select_input'

class FormInput extends React.Component {

	render() {
		const {
			title,
			label,
			display, 
			type, 
			value, 
			placeholder,
			errors,
			validate,
			onChange, 
			onError,
			errorMessage,
			options,
			info
		} = this.props;

		let input;
		switch (type) {
			case "text": 
			case "password":
				input = React.createElement(TextInput, this.props)
				break;
			case "select":
				input = React.createElement(SelectInput, this.props)
				break;
			default: 
				throw (`unrecognized input type: ${type}`)
		}

		return (
			<label>{display}
				{input}
				{React.createElement(InputErrors, this.props)}
				<p>{info}</p>
			</label>
		);
	}
}

export default FormInput;