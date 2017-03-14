import * as C from '../store/constants'
import deepDup from '../utils/deep_dup'

const initialState = {default: (window.localStorage.language || "english")}

const language = (state = initialState, action) => {

	const newState = deepDup(state)
	switch (action.type) {
		case C.SET_LANGUAGE: 
			newState.language.default = action.language
			return newState;
		default: 
			return state;
	}
}

export default language;