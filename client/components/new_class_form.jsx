import React from 'react'
import ClassForm from './class_form'
import {createClass} from '../actions/classes'
import {connect} from 'react-redux'

const EditClassForm = ({ klass, onSubmit }) => (
	<ClassForm onSubmit={onSubmit} klass={klass}/>
)

const mapDispatch = ({
	onSubmit: createClass
})

export default connect(null, mapDispatch)(EditClassForm);