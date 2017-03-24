import C from '../store/constants';

export const clearErrors = id => ({
	type: C.CLEAR_ERRORS,
	id
})
export const receiveErrors = (id, errors) => ({
	type: C.RECEIVE_ERRORS,
	id, 
	errors
})