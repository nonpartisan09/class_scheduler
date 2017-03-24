export const studentSignup = (params, success, error) => ( 
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