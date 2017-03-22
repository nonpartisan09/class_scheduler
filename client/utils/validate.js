export default {
	email: str => str.match("^.+@.+\..+$"),
	name: str => str.match(".+"),
	password: str => str.length > 6,
}
