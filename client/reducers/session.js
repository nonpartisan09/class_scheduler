import C from '../store/constants'
import deepDup from '../utils/deep_dup'

const initialState = {user: undefined}

const session = (state = initialState, action) => {

	const newState = deepDup(state);

	switch (action.type) {
		case C.RECEIVE_CURRENT_USER: 
			newState.user = action.user;
			return newState;
		default: 
			return state;
	}
}

export default session;