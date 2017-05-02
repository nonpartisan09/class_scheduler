import C from '../store/constants';
import deepDup from '../utils/deep_dup';

const notices = (state = [], action) => {

	const newState = deepDup(state);
	const { type, message, category } = action;
	switch (type) {
		case C.RECEIVE_NOTICE: 
			newState.push({ category, message });
			return newState;
		case C.CLEAR_NOTICES: 	
			return [];
		default: 
			return state;
	}
};

export default notices;