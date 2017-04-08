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

	const newState = deepDup(state);

	switch (action.type) {
		case C.RECEIVE_VALUE:
			const { field, form, value } = action;
			if (!newState[form]) newState[form] = newForm();
			newState[form].values[field] = value;
			return newState;
		case C.RECEIVE_ERRORS: 
			newState.errors[action.field] = action.errors;
			return newState;
		case C.CLEAR_ERRORS: 
			delete newState.errors[action.field];
			return newState;
		default: 
			return state;
	}

}

export default errors;