import C from '../store/constants';

export const receiveNotice = (category, message) => ({
	type: C.RECEIVE_NOTICE,
	category,
	message
})