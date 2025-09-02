import type { Book } from "../models/Book";

let currentId = 1;
const books: Book[] = [];

const generateId = () => {
	return currentId++;
};

export { generateId, books };
