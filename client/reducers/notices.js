import C from '../store/constants';
import deepDup from '../utils/deep_dup';

const initialState = () => ({
	errors: [],
	warnings: [],
	infos: [],
	successes: [],
});

const notices = (state = initialState(), action) => {

	const newState = deepDup(state);
	const { type, message, category } = action;
	switch (type) {
		case C.RECEIVE_NOTICE: 
			debugger
			newState[category].push(message);
			return newState;
		default: 
			return state;
	}
};

export default notices;