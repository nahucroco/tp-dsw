import { NotFoundError } from '@mikro-orm/core';
import { orm } from '../data/orm.js';
import { Author } from '../models/Author.js';
import { Book } from '../models/Book.js';
import { Gender } from '../models/Gender.js';
import type { BookInput } from '../schemas/BookSchema.js';
import type { IEntityService } from './interfaces/IEntityService.js';

const em = orm.em;

export class BookService implements IEntityService<Book, BookInput> {
	async getById(id: number): Promise<Book | null> {
		try {
			return await em.findOneOrFail(
				Book,
				{ id: id },
				{ populate: ['gender', 'author'] },
			);
		} catch (e) {
			console.error(`error getById: ${e}`);
			if (e instanceof NotFoundError) {
				return null;
			}
			throw e;
		}
	}

	async getAll(): Promise<Book[]> {
		try {
			return await em.find(Book, {}, { populate: ['gender', 'author'] });
		} catch (e) {
			console.error(`error getAll: ${e}`);
			return [];
		}
	}
	async create(input: {
		id: number;
		title: string;
		author: { id: number };
		gender: { id: number };
	}): Promise<Book> {
		try {
			const book = new Book();
			book.id = input.id;
			book.title = input.title;
			book.author = em.getReference(Author, input.author.id);
			book.gender = em.getReference(Gender, input.gender.id);
			em.create(Book, book);
			await em.flush();
			return book;
		} catch (e) {
			console.error(`error create: ${e}`);
			throw e;
		}
	}

	async update(input: {
		id: number;
		title: string;
		author: { id: number };
		gender: { id: number };
	}): Promise<boolean> {
		try {
			const book = new Book();
			book.id = input.id;
			book.title = input.title;
			book.author = em.getReference(Author, input.author.id);
			book.gender = em.getReference(Gender, input.gender.id);
			const toUpdate = await this.getById(book.id);
			if (!toUpdate) {
				return false;
			}
			em.assign(toUpdate, book);
			await em.flush();
			return true;
		} catch (e) {
			console.error(`error update: ${e}`);
			throw e;
		}
	}
	async delete(id: number): Promise<boolean> {
		try {
			const toDelete = await this.getById(id);
			if (!toDelete) {
				return false;
			}
			await em.removeAndFlush(toDelete);
			return true;
		} catch (e) {
			console.error(`error deleting: ${e}`);
			throw e;
		}
	}
}
