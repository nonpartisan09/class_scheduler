import React from 'react';

import { connect } from 'react-redux';

import { PageHeader, FormGroup, ControlLabel, FormControl, Button }
	from 'react-bootstrap';

import { translate } from '../utils/translate';
import { signup } from '../actions/session';
import { updateValue } from '../actions/forms';

import FieldGroup from './field_group';
import InputErrors from './input_errors';
import ImageInput from './image_input';
import { upload } from '../utils/cloudinary';

const mapState = ({ forms: { signup } }) => ({ formData: signup });
const mapDispatch = ({ 
	updateValue: updateValue('signup'),
	signup
});

class Signup extends React.Component {
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
	submit(e) {
		e.preventDefault();
		const { signup, formData: { values } } = this.props;
		signup(values);
	}
	render(){
		const { tr, formData: { values, errors} } = this.props;
		// const tr = field => field;
		return (
			<main>
				<PageHeader>{tr("sign_up")}</PageHeader>
				<form onSubmit={ this.submit }>
				  <FieldGroup
						id="signup-first-name"
						label={tr("first_name")}
						type="text"
						onChange={this.input('first_name')}
						errors={errors.first_name}
						form="signup"
				  />
				  <FieldGroup
						id="signup-password"
						label={tr("last_name")}
						type="text"
						onChange={this.input('last_name')}
						errors={errors.last_name}
						form="signup"
				  />
				  <FieldGroup
						id="signup-email"
						type="email"
						label={tr("email")}
						onChange={this.input('email')}
						placeholder={tr("email")}
						errors={errors.email}
						form="signup"
				  />
				  <FieldGroup
						id="signup-password"
						label={tr("password")}
						type="password"
						onChange={this.input('password')}
						errors={errors.password}
						form="signup"
				  />
				  <FieldGroup
						id="signup-password-confirmation"
						label={tr("password_confirmation")}
						type="password"
						onChange={this.input('password_confirmation')}
						errors={errors['password_confirmation']}
						form="signup"
				  />
				  <FormGroup controlId="formControlsTextarea">
						<ControlLabel>{tr("about")}</ControlLabel>
						<InputErrors form="signup" errors={errors.about} />
						<FormControl 
							componentClass="textarea"
							onChange={this.input('about')}
						/>
				  </FormGroup>

				  <FormGroup>
				  	<ImageInput />
				  </FormGroup>

				  <Button type="submit">
						{tr("sign_up")}
				  </Button>

				</form>
			</main>
		);
	}
};

export default translate("Form")(connect(mapState, mapDispatch)(Signup));
