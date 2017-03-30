import React from 'react'
import Form from './form'
import {translate} from '../utils/translate'
import {createClass} from '../actions/classes'
import {connect} from 'react-redux'

class ClassForm extends React.Component {
	constructor(props){
		super(props)
		this.formId = "new-class-form"
		this.onSubmit = this.onSubmit.bind(this)
	}
	store(state){
		window.localStorage.setItem("newClassForm", JSON.stringify(state))
	}
	onChange(state){
		console.log(state.schedule)
	}
	onSubmit(state){
		this.props.onSubmit(this.formId, state);
	}
	render(){
		const {tr, klass} = this.props;
		const fields = [
			{label: "title", display: tr("title"), initial: klass.title || ""},
			{label: "description", display: tr("description"), type: "textarea", info: tr("max_chars"), initial: klass.description || ""},
			{label: "category", display: tr("category"), type: "select", initial: klass.category || "naturalization", options: [
				{label: tr("naturalization"), value: "naturalization"},
				{label: tr("english"), value: "english"},
				{label: tr("legal"), value: "legal"},
			]},
			{label: "language", display: tr("language"), type: "select", initial: klass.language || "eng", options: [
				{label: tr("english"), value: "eng"},
				{label: tr("spanish"), value: "spa"},
			]},
			{label: "availability", display: tr("schedule"), type: "availability", initial: klass.availability},
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
					onChange={this.onChange}
				/>
			</section>
		)
	}
}

const mapDispatch = ({
	createClass
})

export default connect(null, mapDispatch)(translate("Classes")(ClassForm));