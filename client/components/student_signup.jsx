import React from 'react'
import Form from './form'
import Billboard from './billboard'
import {translate} from '../utils/translate'
import validate from '../utils/validate'
import {studentSignup} from '../utils/auth'

const stop = res => {debugger}

class StudentSignup extends React.Component {
	constructor() {
		super();
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	handleSubmit(state) {
		const {tr} = this.props;

		return new Promise((resolve, reject) => {
			studentSignup(state, stop, stop);
		});			
	}
	render() {
		const {tr} = this.props

		const fields = [
			{label: "email",  display: tr("email")},
			{label: "first_name",  display: tr("first_name")},
			{label: "last_name",  display: tr("last_name")},
			{label: "password", display: tr("password"), type: "password"},
			{label: "language", info: tr("language_warning"), display: tr("preferred_language"), type: "select", initial: "eng", 
			options: [
				{value: "eng", label: "English", default: true},
				{value: "spa", label: "Spanish"}
			]},
		]

		const billboardBody = <h3>{tr("billboard_text")}</h3>

		return (
			<section id="student-sign-up-page">
				<Billboard 
					title={tr("billboard_title")} 
					body={billboardBody}
				/>
				<Form 
					title="Student Signup"
					id="student-signup"
					fields={fields}
					submitLabel="Sign up!"
					onSubmit={this.handleSubmit}
				/>
			</section>
		);
	}
}

export default translate("Form")(StudentSignup);