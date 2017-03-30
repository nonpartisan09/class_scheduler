import React from 'react';
import FormInput from './form_input';
import {translate} from '../utils/translate';
import InputErrors from './input_errors';
import {connect} from 'react-redux';
import {clearErrors, receiveErrors} from '../actions/errors';
import deepDup from '../utils/deep_dup';

class Form extends React.Component {
	constructor(props){
		super(props);
		this.state = {values: {}}

		props.fields.forEach(f => {
			this.state.values[f.label] = f.initial || "";
		})

		this.handleSubmit = this.handleSubmit.bind(this);
		this.changeHandler = this.changeHandler.bind(this);
	}
	handleSubmit(e){
		e.preventDefault();
		const {clearErrors, receiveErrors, id, onSubmit} = this.props
		const {values} = this.state

		clearErrors(id)
		onSubmit(values)
	}
	changeHandler(label){
		return e => {
			e.preventDefault();
			const newState = deepDup(this.state)
			newState.values[label] = e.currentTarget.value;
			this.setState(newState, () => {
				const {onChange} = this.props
				if (onChange) onChange(this.state.values)
			})
		}
	}
	render() {
		const {tr, fields, id, submitLabel, title, options} = this.props;
		const errors = this.props.errors[id] || {};
		const { values } = this.state;

		const formInputs = fields.map( (f, i) => (
			<FormInput
				options={f.options}
				info={f.info}
				key={`${id}-${f.label}-${i}`}
				label={f.label}
				display={f.display}
				type={f.type || "text"}
				placeholder={f.placeholder}
				initial={f.initial}
				value={values[f.label]}
				errors={errors[f.label]}
				onChange={this.changeHandler(f.label)}
			/>
		));

		return (
			<form id={id} onSubmit={this.handleSubmit}>
				<h2 className="form-title">{title}</h2>
				<InputErrors label="Server Error" errors={errors.server}/>
				{ formInputs }
				<input className="form-submit big button" type="submit" value={submitLabel}/>
			</form>
		)
	}
}

const mapState = ({errors}) => ({errors})
const mapDispatch = ({clearErrors, receiveErrors})

export default connect(mapState, mapDispatch)(Form);