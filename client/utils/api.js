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