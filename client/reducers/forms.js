import C from '../store/constants';
import deepDup from '../utils/deep_dup';

const newForm = () => ({
	values: {},
	errors: {},
});

const initialState = () => ({
	signup: newForm(),
	login: newForm(),
});

const errors = (state = initialState(), action) => {

	const { field, form, value, errors, error } = action;
	const newState = deepDup(state);

	switch (action.type) {
		case C.RECEIVE_VALUE:
			newState[form].values[field] = value;
			return newState;
		case C.RECEIVE_FORM_ERRORS: 
			newState[form].errors = errors;
			return newState;
		case C.RECEIVE_FORM_ERROR:
			newState[form].errors[field] = error;
			return newState;
		case C.CLEAR_ERRORS: 
			delete newState.errors[action.field];
			return newState;
		default: 
			return state;
	}

}

export default errors;