import React from 'react'
import Form from './form'
import Billboard from './billboard'
import {translate} from '../utils/translate'
import validate from '../utils/validate'
import {signup} from '../actions/session'
import {connect} from 'react-redux'
import {FormGroup, ControlLabel, HelpBlock, Checkbox, Radio, FormControl, Button} from 'react-bootstrap';

function FieldGroup({ id, label, help, ...props }) {
  return (
    <FormGroup controlId={id}>
      <ControlLabel>{label}</ControlLabel>
      <FormControl {...props} />
      {help && <HelpBlock>{help}</HelpBlock>}
    </FormGroup>
  );
}

const StudentSignup = () => (
  <form>
    <FieldGroup
      id="formControlsText"
      type="text"
      label="Text"
      placeholder="Enter text"
    />
    <FieldGroup
      id="formControlsEmail"
      type="email"
      label="Email address"
      placeholder="Enter email"
    />
    <FieldGroup
      id="formControlsPassword"
      label="Password"
      type="password"
    />
    <FieldGroup
      id="formControlsFile"
      type="file"
      label="File"
      help="Example block-level help text here."
    />

    <Checkbox checked readOnly>
      Checkbox
    </Checkbox>
    <Radio checked readOnly>
      Radio
    </Radio>

    <FormGroup>
      <Checkbox inline>
        1
      </Checkbox>
      {' '}
      <Checkbox inline>
        2
      </Checkbox>
      {' '}
      <Checkbox inline>
        3
      </Checkbox>
    </FormGroup>
    <FormGroup>
      <Radio inline>
        1
      </Radio>
      {' '}
      <Radio inline>
        2
      </Radio>
      {' '}
      <Radio inline>
        3
      </Radio>
    </FormGroup>

    <FormGroup controlId="formControlsSelect">
      <ControlLabel>Select</ControlLabel>
      <FormControl componentClass="select" placeholder="select">
        <option value="select">select</option>
        <option value="other">...</option>
      </FormControl>
    </FormGroup>
    <FormGroup controlId="formControlsSelectMultiple">
      <ControlLabel>Multiple select</ControlLabel>
      <FormControl componentClass="select" multiple>
        <option value="select">select (multiple)</option>
        <option value="other">...</option>
      </FormControl>
    </FormGroup>

    <FormGroup controlId="formControlsTextarea">
      <ControlLabel>Textarea</ControlLabel>
      <FormControl componentClass="textarea" placeholder="textarea" />
    </FormGroup>

    <FormGroup>
      <ControlLabel>Static text</ControlLabel>
      <FormControl.Static>
        email@example.com
      </FormControl.Static>
    </FormGroup>

    <Button type="submit">
      Submit
    </Button>
  </form>
);

// class StudentSignup extends React.Component {
// 	constructor() {
// 		super();
// 		this.onSubmit = this.onSubmit.bind(this);
// 		this.formId = "student-sign-up"
// 	}
// 	onSubmit(state) {
// 		this.props.signup(this.formId, state)
// 	}
// 	render() {
// 		const {tr, errors} = this.props

// 		const fields = [
// 			{label: "email",  display: tr("email")},
// 			{label: "password", display: tr("password"), type: "password"},
// 			{label: "first_name",  display: tr("first_name")},
// 			{label: "last_name",  display: tr("last_name")},
// 			{label: "phone_number", display: tr("phone_number"), 
// 				info: `${tr("format")}: 555-555-5555`},
// 			{label: "language", display: tr("language"), info: tr("language_warning"), type: "select", initial: "eng", 
// 			options: [
// 				{value: "eng", label: "English", default: true},
// 				{value: "spa", label: "Spanish"}
// 			]},
// 			{label: "image", display: tr("profile_pic"), type: "upload"}
// 		]

// 		const billboardBody = <h3>{tr("billboard_text")}</h3>

// 		return (
// 			<section id="student-sign-up-page">
// 				<Billboard 
// 					title={tr("billboard_title")} 
// 					body={billboardBody}
// 				/>
// 				<main>
// 					<Form 
// 						title="Student Signup"
// 						id={this.formId}
// 						fields={fields}
// 						submitLabel={tr("sign_up")}
// 						onSubmit={this.onSubmit}
// 					/>
// 				</main>
// 			</section>
// 		);
// 	}
// }

const mapDispatch = ({
	signup: signup("students")
})

export default translate("Form")(connect(null, mapDispatch)(StudentSignup));