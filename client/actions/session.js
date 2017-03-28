import C from '../store/constants'
import * as API from '../utils/api'
import {receiveErrors} from './errors'
import {requestPending, requestResolved} from './requests_pending'

export const receiveCurrentUser = user => ({
	type: C.RECEIVE_CURRENT_USER,
	user
})

export const studentSignup = params => dispatch => {
	dispatch(requestPending("student-signup"))

	return API.studentSignup(params).then(
		user => {
			dispatch(receiveCurrentUser(user))
			dispatch(requestResolved("student-signup"))
		},
		err => dispatch(receiveErrors("student-signup", err))
	)
}

export const volunteerSignup = params => dispatch => {
	dispatch(requestPending("volunteer-signup"))

	return API.volunteerSignup(params).then(
		user => {
			dispatch(receiveCurrentUser(user))
			dispatch(requestResolved("volunteer-signup"))
		},
		err => dispatch(receiveErrors("volunteer-signup", err))
	)
}

export const logout = () => dispatch => {
	API.logout().then(() => {dispatch({type: C.LOGOUT})})
}

export const login = params => dispatch => {
	return API.login(params).then(
		user => {
			dispatch(receiveCurrentUser(user))
		},
		err => dispatch(receiveErrors("login", err))
	)
}