import C from '../store/constants';
import * as API from '../utils/api';
import { receiveNotice } from './notices';
import { receiveFormErrors, clearFormErrors } from './forms';
import { requestPending, requestResolved } from './requests_pending';
import { setLanguage } from './language';
import { cleanupKeys } from '../utils/cleanup_keys';


export const receiveCurrentUser = user => dispatch => {

	dispatch({
		type: C.RECEIVE_CURRENT_USER,
		user
	});
	
	if (typeof user.language === "string") dispatch(setLanguage(user.language));
	if (Object.keys(user).length > 0) dispatch({
		type: C.RECEIVE_NOTICE,
		category: "successes",
		message: "Successfully Logged In",
	})
};

export const fetchCurrentUser = () => dispatch => {
	API.fetchCurrentUser().then(user => dispatch(receiveCurrentUser(user)));
};

export const signup = params => dispatch => {
	dispatch(clearFormErrors('signup'));
	API.signup(params).then(
		user => {
			dispatch(receiveCurrentUser(user));
		},
		e => {
			console.log(e);
			if (e.responseJSON) {
				dispatch(receiveFormErrors('signup', cleanupKeys(e.responseJSON.errors)));
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
	dispatch(requestPending(form_id));

	return API.editProfile(type, params).then(
		user => {
			dispatch(receiveCurrentUser(user));
			dispatch(requestResolved(form_id));
		},
		err => dispatch(receiveFormErrors(form_id, err)),
	);
};

export const logout = () => dispatch => {
	API.logout().then(() => { dispatch({ type: C.LOGOUT }) });
};

export const login = params => dispatch => {
	return API.login(params).then(
		user => dispatch(receiveCurrentUser(user)),
		err => dispatch(receiveFormErrors("login", err)),
	);
};