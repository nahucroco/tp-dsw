import { books, generateId } from '../data/BookData.js';
import type { Book } from '../models/Book.js';

import type { IEntityService } from './interfaces/IEntityService.js';

export class BookService implements IEntityService<Book> {
	async getById(id: number): Promise<Book | null> {
		const book = books.find((b) => b.code === id);
		if (!book) return null;
		return book;
	}
	async getAll(): Promise<Book[]> {
		return books;
	}
	async create(entity: Book): Promise<void> {
		entity.code = generateId();
		books.push(entity);
	}
	async update(entity: Book): Promise<boolean> {
		const index = books.findIndex((b) => b.code === entity.code);
		if (index === -1) return false;
		books[index] = entity;
		return true;
	}
	async delete(id: number): Promise<boolean> {
		const index = books.findIndex((b) => b.code === id);
		if (index === -1) return false;
		books.splice(index, 1);
		return true;
	}
}
