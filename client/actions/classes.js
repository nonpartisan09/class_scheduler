import C from '../store/constants';
import {requestPending, requestResolved} from './requests_pending'
import {receiveErrors} from './errors'
import * as API from '../utils/api'

export const createClass = (formId, klass) => dispatch =>{
	dispatch(requestPending("create_class"))
	API.createClass(klass).then(
		klass => {
			dispatch(receiveTaughtClass(klass))
			dispatch(requestResolved("create_class"))
		},
		errors => {
			errors["availability"] = errors["schedule.availability"]
			dispatch(receiveErrors(formId, errors))
			dispatch(requestResolved("create_class"))
		},
	)
}

export const receiveTaughtClass = klass => ({
	type: C.RECEIVE_TAUGHT_CLASS,
	klass
})