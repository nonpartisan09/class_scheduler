const initialState = {default: (window.localStorage.language || "english")}

const language = (state = initialState, action) => {
	return state;
}

export default language;