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