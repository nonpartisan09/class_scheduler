import C from '../store/constants';
import {requestPending, requestResolved} from './requests_pending'
import * as API from '../utils/api'

export const createClass = klass => dispatch =>{
	dispatch(requestPending("create_class"))
	API.createClass(klass).then(
		klass => {
			dispatch(receiveClass(klass))
			dispatch(requestResolved("create_class"))
		},
		errors => {
			dispatch(receiveClassErrors(errors))
			dispatch(requestResolved("create_class"))
		},
	)
}

export const receiveClass = klass => ({
	type: C.RECEIVE_CLASS,
	klass
})

export const receiveClassErrors = errors => ({
	type: C.RECEIVE_CLASS_ERRORS,
	errors
})