import React from 'react'
import Form from './form'
import Billboard from './billboard'
import {translate} from '../utils/translate'
import validate from '../utils/validate'
import {volunteerSignup} from '../actions/session'
import {connect} from 'react-redux'

class VolunteerSignup extends React.Component {
	constructor() {
		super();
		this.onSubmit = this.onSubmit.bind(this);
	}
	onSubmit(state) {
		console.log(state)
		this.props.volunteerSignup(state)
	}
	render() {
		const {tr, errors} = this.props

		const fields = [
			{label: "email",  display: tr("email")},
			{label: "f_name",  display: tr("first_name")},
			{label: "l_name",  display: tr("last_name")},
			{label: "password", display: tr("password"), type: "password"},
			{label: "language", display: tr("volunteer_language"), info: tr("volunteer_language_info"), type: "checkbox", 
			options: [
				{value: "eng", label: "English"},
				{value: "spa", label: "Spanish"}
			]},
			{label: "classes", display: tr("classes"), type: "checkbox", 
			info: tr("classes_info"),
			options: [
				{value: "naturalization", label: "Naturalization"},
				{value: "english", label: "English"},
				{value: "legal", label: "Legal Advice"}
			]}
		]

		const billboardBody = <h3>{tr("billboard_text")}</h3>

		return (
			<section id="volunteer-sign-up-page">
				<Billboard 
					title={tr("billboard_title")} 
					body={billboardBody}
				/>
				<Form 
					title="Volunteer Signup"
					id="volunteer-signup"
					fields={fields}
					submitLabel="Sign up!"
					onSubmit={this.onSubmit}
				/>
			</section>
		);
	}
}

const mapDispatch = ({
	volunteerSignup
})

export default translate("Form")(connect(null, mapDispatch)(VolunteerSignup));