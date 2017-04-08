import React from 'react';

import { connect } from 'react-redux';

import { PageHeader, FormGroup, ControlLabel, FormControl, Button }
	from 'react-bootstrap';

import { translate } from '../utils/translate';
import { signup } from '../actions/session';
import { updateValue } from '../actions/form';

import FieldGroup from './field_group';

class Signup extends React.Component {
	constructor(){
		super();
		this.input = this.input.bind(this);
		this.submit = this.submit.bind(this);
	}
	input(field) {
		return e => {
			e.preventDefault();
			this.props.updateValue(field, e.currentTarget.value);
		};
	}
	submit(e) {
		e.preventDefault();
		const { signup, formData: { values } } = this.props;
		signup(values);
	}
	render(){
		const { tr } = this.props;
		// const tr = field => field;
		return (
			<main>
				<PageHeader>{tr("sign_up")}</PageHeader>
				<form onSubmit={ this.submit }>
				  <FieldGroup
						id="signup-email"
						type={tr("email")}
						onChange={this.input('email')}
						placeholder={tr("email")}
				  />
				  <FieldGroup
						id="signup-password"
						label={tr("password")}
						type="password"
						onChange={this.input('password')}
				  />
				  <FieldGroup
						id="signup-password-confirm"
						label={tr("confirm_password")}
						type="password"
						onChange={this.input('password-confirm')}
				  />

				  <FormGroup controlId="formControlsTextarea">
						<ControlLabel>{tr("about")}</ControlLabel>
						<FormControl 
							componentClass="textarea"
							onChange={this.input('about')}
						/>
				  </FormGroup>

				  <Button type="submit">
						{tr("sign_up")}
				  </Button>

				</form>
			</main>
		);
	}
};

const mapState = ({ form: { signup } }) => ({ formData: signup });
const mapDispatch = ({ 
	updateValue: updateValue('signup'),
	signup
});

export default translate("Form")(connect(mapState, mapDispatch)(Signup));

// export default connect(mapState, mapDispatch)(Signup);

// class StudentSignup extends React.Component {
// 	constructor() {
// 		super();
// 		this.onSubmit = this.onSubmit.bind(this);
// 		this.formId = "student-sign-up"
// 	}
// 	onSubmit(state) {
// 		this.props.signup(this.formId, state)
// 	}
// 	render() {
// 		const {tr, errors} = this.props

// 		const fields = [
// 			{label: "email",  display: tr("email")},
// 			{label: "password", display: tr("password"), type: "password"},
// 			{label: "first_name",  display: tr("first_name")},
// 			{label: "last_name",  display: tr("last_name")},
// 			{label: "phone_number", display: tr("phone_number"), 
// 				info: `${tr("format")}: 555-555-5555`},
// 			{label: "language", display: tr("language"), info: tr("language_warning"), type: "select", initial: "eng", 
// 			options: [
// 				{value: "eng", label: "English", default: true},
// 				{value: "spa", label: "Spanish"}
// 			]},
// 			{label: "image", display: tr("profile_pic"), type: "upload"}
// 		]

// 		const billboardBody = <h3>{tr("billboard_text")}</h3>

// 		return (
// 			<section id="student-sign-up-page">
// 				<Billboard 
// 					title={tr("billboard_title")} 
// 					body={billboardBody}
// 				/>
// 				<main>
// 					<Form 
// 						title="Student Signup"
// 						id={this.formId}
// 						fields={fields}
// 						submitLabel={tr("sign_up")}
// 						onSubmit={this.onSubmit}
// 					/>
// 				</main>
// 			</section>
// 		);
// 	}
// }
