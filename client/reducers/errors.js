import C from '../store/constants'
import deepDup from '../utils/deep_dup'

const errors = (state = {}, action) => {

	const newState = deepDup(state)
	switch (action.type) {
		case C.RECEIVE_ERRORS: 
			newState[action.id] = action.errors
			return newState;
		case C.CLEAR_ERRORS: 
			newState[action.id] = {}
			return newState;
		default: 
			return state;
	}
}

export default errors;