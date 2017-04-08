// export const getTutors () => fetch('api/tutors').then(r => r.json())
// export const getStudents () => fetch('api/students').then(r => r.json())



export const fetchCurrentUser = () => ( 
	new Promise((res, rej) => {
		const success = r => res(r);
		const error = e => {
			if (e.status === 422) {			
				rej(e.responseJSON);
			} else {
				rej({server: ["Server Error"]})
			}
		}
		$.ajax({
			url: `api/current_user`,
			method: "GET",
			success,
			error
		})
	})
)

export const signup = params => ( 
	$.ajax({
		url: 'api/users',
		method: 'post',
		data: { user: params },
	})
);

export const editProfile = (type, params) => {
	console.log(params)
	return ( 
	new Promise((res, rej) => {
		const success = r => res(r);
		const error = e => {
			if (e.status === 422) {			
				rej(e.responseJSON);
			} else {
				rej({server: ["Server Error"]})
			}
		}
		$.ajax({
			url: `api/${type}/${params.id}`,
			method: "PATCH",
			data: { 
				user: params,
			},
			success,
			error
		})
	})
)
}

export const logout = () => (
	new Promise((res, rej) => {
		const success = r => { 
			res(r);
		}
		const error = e => {
			if (e.status === 422) {			
				rej(e.responseJSON);
			} else {
				rej({server: ["Server Error"]})
			}
		}		
		$.ajax({
			url: "/api/users/sign_out",
			method: "DELETE",
			success, 
			error
		})
	})
)

export const login = params => (
	new Promise((res, rej) => {
		const success = r => { 
			res(r);
		}
		const error = e => {
			rej(e.responseJSON)
		}

		$.ajax({
			url: "/api/users/sign_in",
			method: "POST",
			data: params,
			success, 
			error
		})
	})
)


export const createClass = params => (
	new Promise((res, rej) => {
		const success = r => { 
			res(r);
		}
		const error = e => {
			rej(e.responseJSON)
		}

		$.ajax({
			url: "/api/klasses",
			method: "POST",
			data: {klass: params},
			success, 
			error
		})
	})
)