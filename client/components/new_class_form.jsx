import React from 'react'
import Form from './form'
import {translate} from '../utils/translate'
import {createClass} from '../actions/classes'
import {connect} from 'react-redux'

class NewClassForm extends React.Component {
	constructor(){
		super()
		this.formId = "new-class-form"
		this.onSubmit = this.onSubmit.bind(this)
	}
	store(state){
		window.localStorage.setItem("newClassForm", JSON.stringify(state))
	}
	onSubmit(state){
		console.log(state)
		this.props.createClass(this.formId, state);
	}
	render(){
		const {tr} = this.props;
		const fields = [
			{label: "title", display: tr("title")},
			{label: "description", display: tr("description"), type: "textarea", info: tr("max_chars")},
			{label: "category", display: tr("category"), type: "select", initial: "naturalization", options: [
				{label: tr("naturalization"), value: "naturalization"},
				{label: tr("english"), value: "english"},
				{label: tr("legal"), value: "legal"},
			]},
			{label: "language", display: tr("language"), type: "select", initial: "eng", options: [
				{label: tr("english"), value: "eng"},
				{label: tr("spanish"), value: "spa"},
			]},
			{label: "availability", display: tr("availability"), type: "availability"},
		]
		return (
			<section id="new-class-form">
				<Form 
					title={tr("class_form_title")}
					id={this.formId}
					fields={fields}
					submitLabel={tr("create_class")}
					onChange={this.store}
					onSubmit={this.onSubmit}
				/>
			</section>
		)
	}
}

const mapDispatch = ({
	createClass
})

export default connect(null, mapDispatch)(translate("Classes")(NewClassForm));