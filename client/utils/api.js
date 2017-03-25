// export const getTutors () => fetch('api/tutors').then(r => r.json())
// export const getStudents () => fetch('api/students').then(r => r.json())

export const studentSignup = params => ( 
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
			url: "/api/students", 
			method: "POST",
			data: { 
				user: params,
			},
			success,
			error
		})
	})
)

export const volunteerSignup = params => ( 
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
			url: "/api/tutors", 
			method: "POST",
			data: { 
				user: params,
			},
			success,
			error
		})
	})
)

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