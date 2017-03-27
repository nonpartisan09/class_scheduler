import React from 'react'
import Form from './form'
import Billboard from './billboard'
import {translate} from '../utils/translate'
import validate from '../utils/validate'
import {volunteerSignup} from '../actions/session'
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
	}
	onSubmit(state) {
		this.props.volunteerSignup(state)
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
			{label: "f_name",  display: tr("first_name")},
			{label: "l_name",  display: tr("last_name")},
			{label: "password", display: tr("password"), type: "password"},
			{label: "phone_number", display: tr("phone_number"), 
				info: `${tr("format")}: 555-555-5555`},
			{label: "profile_src", display: tr("profile_pic"), type: "upload"}
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

const mapState = ({session: {user}}) => ({user})

const mapDispatch = ({
	volunteerSignup
})

export default translate("Form")(connect(mapState, mapDispatch)(VolunteerSignup));