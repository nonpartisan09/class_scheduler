import React from 'react'
import Form from './form'
import Billboard from './billboard'
import {translate} from '../utils/translate'
import validate from '../utils/validate'
import {login} from '../actions/session'
import {connect} from 'react-redux'

class Login extends React.Component {
	constructor() {
		super();
		this.onSubmit = this.onSubmit.bind(this);
	}
	onSubmit(state) {
		this.props.login(state)
	}
	render() {
		const {tr, errors} = this.props

		const fields = [
			{label: "email",  display: tr("email")},
			{label: "password", display: tr("password"), type: "password"},
		]

		const billboardBody = <h3>{tr("billboard_text")}</h3>

		return (
			<section id="login-page">
				<Billboard 
					title={tr("billboard_title")} 
					body={billboardBody}
				/>
				<Form 
					title={tr("login")}
					id="login"
					fields={fields}
					submitLabel="Login"
					onSubmit={this.onSubmit}
				/>
			</section>
		);
	}
}

const mapDispatch = ({
	login
})

export default translate("Form")(connect(null, mapDispatch)(Login));