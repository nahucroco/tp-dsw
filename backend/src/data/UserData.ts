import type { User } from '../models/User.js';

let currentId = 1;
const users: User[] = [];
const generateId = () => {
	return currentId++;
};
export { users, generateId };
