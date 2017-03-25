import C from '../store/constants'
import * as API from '../utils/api'
import {receiveErrors} from './errors'

export const receiveCurrentUser = user => ({
	type: C.RECEIVE_CURRENT_USER,
	user
})

export const studentSignup = params => dispatch => {
	return API.studentSignup(params).then(
		user => {
			localStorage.setItem('user', JSON.stringify(user))
			dispatch(receiveCurrentUser(user))
		},
		err => dispatch(receiveErrors("student-signup", err))
	)
}

export const volunteerSignup = params => dispatch => {
	return API.volunteerSignup(params).then(
		user => {
			localStorage.setItem('user', JSON.stringify(user))
			dispatch(receiveCurrentUser(user))
		},
		err => dispatch(receiveErrors("volunteer-signup", err))
	)
}

export const logout = () => dispatch => {
	localStorage.setItem('user', JSON.stringify({}))
	API.logout().then(() => {dispatch({type: "LOGOUT"})})
}

export const login = params => dispatch => {
	return API.login(params).then(
		user => {
			localStorage.setItem('user', JSON.stringify(user))
			dispatch(receiveCurrentUser(user))
		},
		err => dispatch(receiveErrors("login", err))
	)
}