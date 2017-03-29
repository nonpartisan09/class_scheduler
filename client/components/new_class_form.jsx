import React from 'react'
import Form from './form'
import {translate} from '../utils/translate'

class NewClassForm extends React.Component {
	constructor(){
		super()
		this.formId = "new-class"
		this.onSubmit = this.onSubmit.bind(this)
	}
	store(state){
		window.localStorage.setItem("newClassForm", JSON.stringify(state))
	}
	onSubmit(state){
		console.log(state)
	}
	render(){
		const {tr} = this.props;
		const fields = [
			{label: "name", display: tr("name")},
			{label: "description", display: tr("description"), type: "textarea", info: tr("max_chars")},
			{label: "category", display: tr("category"), type: "select", options: [
				{label: "Legal", value: "legal"},
				{label: "Naturalization", value: "naturalization"},
				{label: "English", value: "english"},
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

export default translate("Classes")(NewClassForm);