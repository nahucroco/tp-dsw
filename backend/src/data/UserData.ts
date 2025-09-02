import type { User } from "../models/User";
let currentId = 1;
const users: User[] = [];
const generateId = () => {
	return currentId++;
};
export { users, generateId };
