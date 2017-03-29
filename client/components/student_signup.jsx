import React from 'react'
import Form from './form'
import Billboard from './billboard'
import {translate} from '../utils/translate'
import validate from '../utils/validate'
import {signup} from '../actions/session'
import {connect} from 'react-redux'

class StudentSignup extends React.Component {
	constructor() {
		super();
		this.onSubmit = this.onSubmit.bind(this);
		this.formId = "student-sign-up"
	}
	onSubmit(state) {
		this.props.signup(this.formId, state)
	}
	render() {
		const {tr, errors} = this.props

		const fields = [
			{label: "email",  display: tr("email")},
			{label: "password", display: tr("password"), type: "password"},
			{label: "f_name",  display: tr("first_name")},
			{label: "l_name",  display: tr("last_name")},
			{label: "phone_number", display: tr("phone_number"), 
				info: `${tr("format")}: 555-555-5555`},
			{label: "language", display: tr("language"), info: tr("language_warning"), type: "select", initial: "eng", 
			options: [
				{value: "eng", label: "English", default: true},
				{value: "spa", label: "Spanish"}
			]},
			{label: "image", display: tr("profile_pic"), type: "upload"}
		]

		const billboardBody = <h3>{tr("billboard_text")}</h3>

		return (
			<section id="student-sign-up-page">
				<Billboard 
					title={tr("billboard_title")} 
					body={billboardBody}
				/>
				<main>
					<Form 
						title="Student Signup"
						id={this.formId}
						fields={fields}
						submitLabel={tr("sign_up")}
						onSubmit={this.onSubmit}
					/>
				</main>
			</section>
		);
	}
}

const mapDispatch = ({
	signup: signup("students")
})

export default translate("Form")(connect(null, mapDispatch)(StudentSignup));