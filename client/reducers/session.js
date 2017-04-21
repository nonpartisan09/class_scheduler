import C from '../store/constants';
import deepDup from '../utils/deep_dup';

const initialState = { user: {} };

const session = (state = initialState, action) => {

	const newState = deepDup(state);

	switch (action.type) {
		case C.RECEIVE_CURRENT_USER: 
			window.localStorage.user = JSON.stringify(
				newState.user = action.user
			);
			return newState;
		case C.RECEIVE_TAUGHT_CLASS:
			newState.user.classes_taught.push(action.klass);
			return newState;
		case C.LOGOUT: 
			window.localStorage.user = JSON.stringify(
				newState.user = {}
			);			
			return newState;
		default: 
			return state;
	}
}

export default session;