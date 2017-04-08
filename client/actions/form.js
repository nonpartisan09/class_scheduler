import C from '../store/constants';

export const updateValue = form => (field, value) => dispatch => {
	dispatch ({
		type: C.RECEIVE_VALUE,
		form,
		field,
		value,
	});
};

export const receiveFormErrors = (form, errors) => ({
	type: C.RECEIVE_FORM_ERRORS,
	form,
	errors
})