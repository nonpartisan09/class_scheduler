import React from 'react'
import ClassForm from './class_form'

const EditClassForm = ({ klass, onSubmit }) => (
	<ClassForm onSubmit={onSubmit} klass={klass}/>
)

export default EditClassForm;