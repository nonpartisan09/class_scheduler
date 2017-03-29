import React from 'react'
import Form from './form'
import Billboard from './billboard'
import {translate} from '../utils/translate'
import validate from '../utils/validate'
import {editProfile} from '../actions/session'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'

class VolunteerProfile extends React.Component {
	constructor(props) {
		super(props);
		this.onSubmit = this.onSubmit.bind(this);
		this.formId = "volunteer_edit"
	}
	onSubmit(state) {
		state.id = this.props.user.id
		this.props.editProfile(this.formId, state)
	}
	render() {
		const {tr, errors, user } = this.props
		const fields = [
			{label: "email",  display: tr("email"), initial: user.email},
			{label: "f_name",  display: tr("first_name"), initial: user.f_name},
			{label: "l_name",  display: tr("last_name"), initial: user.l_name},
			{label: "phone_number", display: tr("phone_number"), initial: user.phone_number, 
				info: `${tr("format")}: 555-555-5555`},
			{label: "language", display: tr("language"), type: "select", initial: user.language, 
			options: [
				{value: "eng", label: "English", default: true},
				{value: "spa", label: "Spanish"}
			]},
			{label: "image", display: tr("profile_pic"), type: "upload", initial: user.profile_src}
		]

		const billboardBody = <h3>{tr("billboard_text")}</h3>

		return (
			<section id="volunteer-profile">
				<main>
					<Form 
						title={tr("edit_title")}
						id={this.formId}
						fields={fields}
						submitLabel={tr("edit")}
						onSubmit={this.onSubmit}
					/>
				</main>
			</section>
		);
	}
}

const mapState = ({session: {user}}) => ({ user })

const mapDispatch = ({
	editProfile: editProfile("tutors")
})

export default translate("Form")(connect(mapState, mapDispatch)(VolunteerProfile));