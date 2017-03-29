import C from '../store/constants';
import {requestPending, requestResolved} from './requests_pending'
import {receiveErrors} from './errors'
import * as API from '../utils/api'

export const createClass = (formId, klass) => dispatch =>{
	dispatch(requestPending("create_class"))
	API.createClass(klass).then(
		klass => {
			dispatch(receiveClass(klass))
			dispatch(requestResolved("create_class"))
		},
		errors => {
			errors["availability"] = errors["schedule.availability"]
			dispatch(receiveErrors(formId, errors))
			dispatch(requestResolved("create_class"))
		},
	)
}

export const receiveClass = klass => ({
	type: C.RECEIVE_CLASS,
	klass
})