import React from 'react'
import validate from '../utils/validate'
import InputErrors from './input_errors'
import TextInput from './text_input'
import SelectInput from './select_input'
import CheckboxInput from './checkbox_input'
import UploadInput from './upload_input'
import AvailabilityInput from './availability_input'

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
			case "checkbox":
				input = React.createElement(CheckboxInput, this.props)
				break;
			case "text": 
			case "textarea":
			case "password":
				input = React.createElement(TextInput, this.props)
				break;
			case "select":
				input = React.createElement(SelectInput, this.props)
				break;
			case "upload":
				input = React.createElement(UploadInput, this.props);
				break;
			case "availability":
				input = React.createElement(AvailabilityInput, this.props);
				break;
			default: 
				throw (`unrecognized input type: ${type}`)
		}

		return (
			<label className="form-input">{display}
				{React.createElement(InputErrors, this.props)}
				<p className="input-info">{info}</p>
				{input}
			</label>
		);
	}
}

export default FormInput;