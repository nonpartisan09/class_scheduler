import C from '../store/constants';
import * as API from '../utils/api';
import {receiveNotice} from './notices';
import { receiveFormErrors } from './forms';
import {requestPending, requestResolved} from './requests_pending';
import {setLanguage} from './language';

export const fetchCurrentUser = () => dispatch => {
	API.fetchCurrentUser().then(user => {dispatch(receiveCurrentUser(user))})
};

export const receiveCurrentUser = user => dispatch => {

	dispatch({
		type: C.RECEIVE_CURRENT_USER,
		user
	});
	dispatch(setLanguage(user.language));
};

export const signup = params => dispatch => {
	API.signup(params).then(
		user => {
			dispatch(receiveCurrentUser(user))
		},
		e => {
			if (e.responseJSON) {
				dispatch(receiveFormErrors('signup', e.responseJSON.errors));
				dispatch(receiveNotice('errors', 'not_saved'));
			} else {
				dispatch(receiveNotice('errors', 'server_error'));
			}
		},
	);
};

	// dispatch(requestPending(form_id))

	// return API.signup(type, params).then(
	// 	user => {
	// 		dispatch(receiveCurrentUser(user))
	// 		dispatch(requestResolved(form_id))
	// 	},
	// 	err => dispatch(receiveErrors(form_id, err))
	// )

export const editProfile = type => (form_id, params) => dispatch => {
	dispatch(requestPending(form_id))

	return API.editProfile(type, params).then(
		user => {
			dispatch(receiveCurrentUser(user))
			dispatch(requestResolved(form_id))
		},
		err => dispatch(receiveErrors(form_id, err))
	);
};

export const logout = () => dispatch => {
	API.logout().then(() => { dispatch({ type: C.LOGOUT }) });
};

export const login = params => dispatch => {
	return API.login(params).then(
		user => {
			dispatch(receiveCurrentUser(user));
		},
		err => dispatch(receiveErrors("login", err));
	);
};