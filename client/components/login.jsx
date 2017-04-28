import React from 'react';
import { connect } from 'react-redux';
import { PageHeader, FormGroup, ControlLabel, FormControl, Button }
	from 'react-bootstrap';
import { translate } from '../utils/translate';
import { login } from '../actions/session';
import { updateValue } from '../actions/forms';
import FieldGroup from './field_group';

const mapState = ({ forms: { login } }) => ({ formData: login });
const mapDispatch = ({ 
	updateValue: updateValue('login'),
	login,
});

class Login extends React.Component {
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
	submit (e) {
		const { login, formData: { values } } = this.props;
		login(values);
	}
	render() {
		const { tr, formData: { errors } } = this.props;
		return (
			<main>
				<PageHeader>{tr("login")}</PageHeader>
				<form onSubmit={ this.submit }>
				  <FieldGroup
						id="login-email"
						type="email"
						label={tr("email")}
						onChange={this.input('email')}
						errors={errors.email}
						form="login"
				  />
				  <FieldGroup
						id="login-password"
						label={tr("password")}
						type="password"
						onChange={this.input('password')}
						errors={errors.password}
						form="login"
				  />
				  <Button type="submit">
						{tr("sign_up")}
				  </Button>
				</form>
			</main>
		);
	}
};

export default translate("Form")(connect(mapState, mapDispatch)(Login));