export const read = (blob, cb) => {
	const reader = new FileReader();
	reader.onload = e => {
		cb(e.currentTarget.result)
	}
	reader.readAsDataURL(blob)
}