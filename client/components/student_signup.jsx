import React from 'react'
import Form from './form'
import Billboard from './billboard'
import {translate} from '../utils/translate'
import validate from '../utils/validate'
import {studentSignup} from '../actions/session'
import {connect} from 'react-redux'

class StudentSignup extends React.Component {
	constructor() {
		super();
		this.onSubmit = this.onSubmit.bind(this);
	}
	onSubmit(state) {
		this.props.studentSignup(state)
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
			{label: "language", display: tr("preferred_language"), info: tr("language_warning"), type: "select", initial: "eng", 
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
						id="student-signup"
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
	studentSignup
})

export default translate("Form")(connect(null, mapDispatch)(StudentSignup));