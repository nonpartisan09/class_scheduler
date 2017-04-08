import React from 'react';

import { connect } from 'react-redux';

import {
	PageHeader, FormGroup, ControlLabel, FormControl, Button,
} from 'react-bootstrap';

import { translate } from '../utils/translate';
import { signup } from '../actions/session';
import FieldGroup from './field_group';


class Signup extends React.Component {
	render() {
		const { tr, signup } = this.props;
		return (
			<main>
				<PageHeader>{tr("sign_up")}</PageHeader>
				<form>

				  <FieldGroup
						id="signup-about"
						name="user[email]"
						type={tr("email")}
						placeholder={tr("email")}
				  />
				  <FieldGroup
						id="signup-password"
						name="user[password]"
						label={tr("password")}
						type="password"
				  />
				   <FieldGroup
						id="signup-password-confirm"
						label={tr("confirm_password")}
						type="password"
				  />

				  <FormGroup controlId="formControlsTextarea">
						<ControlLabel>{tr("about")}</ControlLabel>
						<FormControl 
							componentClass="textarea" 
							placeholder="textarea"
							name="user[about]" />
				  </FormGroup>

				  <Button type="submit">
						{tr("sign_up")}
				  </Button>

				</form>
			</main>
		);
	}
}

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

const mapDispatch = ({
	signup: signup("students")
})

export default translate("Form")(connect(null, mapDispatch)(StudentSignup));