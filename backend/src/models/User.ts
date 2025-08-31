class User {
	constructor(
		id: number,
		fullName: string,
		username: string,
		password: string,
		email: string,
	) {
		this.id = id;
		this.fullName = fullName;
		this.username = username;
		this.password = password;
		this.email = email;
	}
	id: number;
	fullName: string;
	username: string;
	password: string;
	email: string;
}
export { User };
