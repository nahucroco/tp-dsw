import { NotFoundError } from '../errors/NotFoundError.js';
import { orm } from '../infrastructure/orm.js';
import { Book } from '../models/Book.js';
import { BookCopy } from '../models/BookCopy.js';
import type { BookCopyInput } from '../schemas/BookCopySchema.js';
import type { IEntityService } from './interfaces/IEntityService.js';

const em = orm.em;

export class BookCopyService
	implements IEntityService<BookCopy, BookCopyInput>
{
	async getById(id: number): Promise<BookCopy> {
		const bookCopy = await em.findOne(BookCopy, { id }, { populate: ['book'] });
		if (!bookCopy) {
			throw new NotFoundError('Book copy not found');
		}
		return bookCopy;
	}

	async getAll(): Promise<BookCopy[]> {
		return await em.find(BookCopy, {}, { populate: ['book'] });
	}

	async create(input: BookCopyInput): Promise<BookCopy> {
		const copy = new BookCopy();
		copy.is_available = input.is_available;
		copy.condition = input.condition;
		copy.book = em.getReference(Book, input.book.id);
		em.create(BookCopy, copy);
		await em.flush();
		return copy;
	}

	async update(input: BookCopyInput): Promise<void> {
		const copy = await this.getById(input.id);
		copy.is_available = input.is_available;
		copy.condition = input.condition;
		copy.book = em.getReference(Book, input.book.id);
		await em.flush();
	}

	async delete(id: number): Promise<void> {
		const copy = await this.getById(id);
		await em.remove(copy).flush();
	}
}
