import React from 'react';
import FormInput from './form_input';
import validate from '../utils/validate';
import {translate} from '../utils/translate';

class Form extends React.Component {
	constructor(props){
		super(props);
		this.state = {values: {}, errors: {}}

		props.fields.forEach(f => {
			this.state.values[f.label] = f.initial || "";
			this.state.errors[f.label] = [];
		})

		this.handleSubmit = this.handleSubmit.bind(this);
		this.changeHandler = this.changeHandler.bind(this);
		this.errorHandler = this.errorHandler.bind(this);
	}
	handleSubmit(e){
		e.preventDefault();

		this.props.onSubmit(this.state).then( errors => {
			this.setState({ errors })
		});
	}
	changeHandler(label){
		return e => {
			e.preventDefault();
			const newState = JSON.parse(JSON.stringify(this.state))
			newState.values[label] = e.currentTarget.value;
			this.setState(newState)
		}
	}
	errorHandler(label) {
		return err => {
			const newState = JSON.parse(JSON.stringify(this.state))
			newState.errors[label] = err;
			this.setState(newState)
		}
	}
	render() {
		const {tr, fields, id, submitLabel, title, options} = this.props;
		const { values, errors } = this.state;
		const formInputs = fields.map( (f, i) => (
			<FormInput
				options={f.options}
				info={f.info}
				key={`${id}-${f.label}-${i}`}
				label={f.label}
				display={f.display}
				type={f.type || "text"}
				placeholder={f.placeholder || ""}
				value={values[f.label]}
				errors={errors[f.label]}
				validate={validate.email}
				onChange={this.changeHandler(f.label)}
				onError={this.errorHandler(f.label)}
				validationMessage={f.validationMessage}
			/>
		));

		return (
			<form id={id} onSubmit={this.handleSubmit}>
				<h2 className="form-title">{title}</h2>
				{ formInputs }
				<input type="submit" value={submitLabel}/>
			</form>
		)
	}
}

export default Form;