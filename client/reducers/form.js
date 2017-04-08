import C from '../store/constants'
import deepDup from '../utils/deep_dup'

const errors = (state = {values: {}, errors: {}}, action) => {

	const newState = deepDup(state)

	switch (action.type) {
		case C.RECEIVE_VALUE:
			newState.values[action.field] = action.value;
			return newState;
		case C.RECEIVE_ERRORS: 
			newState.errors[action.field] = action.errors
			return newState;
		case C.CLEAR_ERRORS: 
			delete newState.errors[action.field]
			return newState;
		default: 
			return state;
	}

}

export default errors;