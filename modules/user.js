export default class User {

	constructor(username, email, password) {
		this.username = username;
		this.email = email;
		this.password = password;
	}

	getUsername() {
		return this.username;
	}
}
