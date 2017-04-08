import React from 'react'
import Form from './form'
import Billboard from './billboard'
import {translate} from '../utils/translate'
import validate from '../utils/validate'
import {signup} from '../actions/session'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'

function redirectIfLoggedIn(user) {
	if (user.id) {
		hashHistory.push("/volunteer/dashboard")
	}
}

class VolunteerSignup extends React.Component {
	constructor(props) {
		super(props);
		this.onSubmit = this.onSubmit.bind(this);
		this.formId="volunteer-signup"
	}
	onSubmit(state) {
		this.props.signup(this.formId, state)
	}
	componentWillMount() {
		redirectIfLoggedIn(this.props.user);
	}
	componentWillReceiveProps({user}) {
		redirectIfLoggedIn(user);
	}

	render() {
		const {tr, errors} = this.props
		const fields = [
			{label: "email",  display: tr("email")},
			{label: "password", display: tr("password"), type: "password"},
			{label: "first_name",  display: tr("first_name")},
			{label: "last_name",  display: tr("last_name")},
			{label: "phone_number", display: tr("phone_number"), 
				info: `${tr("format")}: 555-555-5555`},
			{label: "language", display: tr("language"), type: "select", initial: "eng", 
			options: [
				{value: "eng", label: "English"},
				{value: "spa", label: "Spanish"}
			]},
			{label: "image", display: tr("profile_pic"), type: "upload"}
		]

		const billboardBody = <h3>{tr("billboard_text")}</h3>

		return (
			<section id="volunteer-sign-up-page">
				<Billboard 
					title={tr("billboard_title")} 
					body={billboardBody}
				/>
				<main>
					<Form 
						title={tr("volunteer_signup_title")}
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

const mapState = ({session: {user}}) => ({user})

const mapDispatch = ({
	signup: signup("tutors")
})

export default translate("Form")(connect(mapState, mapDispatch)(VolunteerSignup));