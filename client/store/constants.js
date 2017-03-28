const keys = [
	// session
	'RECEIVE_CURRENT_USER',
	'LOGOUT',
	// language
	'SET_LANGUAGE',
	// errors
	'CLEAR_ERRORS',
	'RECEIVE_ERRORS',
	// requests pending
	'REQUEST_PENDING',
	'REQUEST_RESOLVED'
]

const constants = {}
keys.forEach(key => constants[key] = key)

export default constants;