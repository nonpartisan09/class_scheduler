/* eslint camelcase: "false" */

const cloud_name = 'tutoria';
const upload_preset = 'profile_src';

export const urlFor = (publicId) => `https://res.cloudinary.com/tutoria/image/upload/${publicId}`

export const upload = file => {
	console.log('start image post')
	const method = 'post';
	const resource_type = 'image';
	const url = `https://api.cloudinary.com/v1_1/${cloud_name}/${resource_type}/upload`;

	if (file) {
		return new Promise((success, error) => {
			$.ajax({
				url,
				method,
				data: {
					file,
					upload_preset,
				},
				success,
				error
			})
		});
	} else {
		return Promise.resolve({ public_id: null });
	}
};