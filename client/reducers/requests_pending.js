import C from '../store/constants'
import deepDup from '../utils/deep_dup'

const initialState = {}

const requestPending = (state = initialState, action) => {

	const newState = deepDup(state);

	switch (action.type) {
		case C.REQUEST_PENDING:
			newState[action.request] = true;
			return newState;
		case C.REQUEST_RESOLVED: 
			newState[action.request] = false;
			return newState;
		default: 
			return state;
	}
}

export default requestPending;