import C from '../store/constants'

export const requestPending = request => ({ 
	type: C.REQUEST_PENDING,
	request 
})
export const requestResolved = request => ({ 
	type: C.REQUEST_RESOLVED,
	request 
})