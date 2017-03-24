export const studentSignup = (params, success, error) => {
	$.ajax({
		url: "/api/students", 
		method: "POST",
		data: { 
			user: params,
		}
	}).then(success, error)
}