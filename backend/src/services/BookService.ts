import { NotFoundError } from '../errors/NotFoundError.js';
import { orm } from '../infrastructure/orm.js';
import { Author } from '../models/Author.js';
import { Book } from '../models/Book.js';
import { Genre } from '../models/Genre.js';
import { Publisher } from '../models/Publisher.js';
import type { BookInput } from '../schemas/BookSchema.js';
import type { IEntityService } from './interfaces/IEntityService.js';

const em = orm.em;

export class BookService implements IEntityService<Book, BookInput> {
	async getById(id: number): Promise<Book> {
		const book = await em.findOne(
			Book,
			{ id: id },
			{ populate: ['gender', 'author', 'publisher'] },
		);
		if (!book) {
			throw new NotFoundError('Book not found.');
		}
		return book;
	}

	async getAll(): Promise<Book[]> {
		return await em.find(
			Book,
			{},
			{ populate: ['gender', 'author', 'publisher'] },
		);
	}

	async create(input: BookInput): Promise<Book> {
		const book = new Book();
		book.title = input.title;
		book.author = em.getReference(Author, input.author.id);
		book.gender = em.getReference(Genre, input.gender.id);
		book.publisher = em.getReference(Publisher, input.publisher.id);
		em.create(Book, book);
		await em.flush();
		return book;
	}

	async update(input: BookInput): Promise<void> {
		const book = await this.getById(input.id);
		book.title = input.title;
		book.author = em.getReference(Author, input.author.id);
		book.gender = em.getReference(Genre, input.gender.id);
		book.publisher = em.getReference(Publisher, input.publisher.id);
		await em.flush();
	}

	async delete(id: number): Promise<void> {
		const toDelete = await this.getById(id);
		await em.remove(toDelete).flush();
	}
}
