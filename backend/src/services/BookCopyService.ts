import { NotFoundError } from '@mikro-orm/core';
import { orm } from '../data/orm.js';
import { Book } from '../models/Book.js';
import { BookCopy } from '../models/BookCopy.js';
import type { BookCopyInput } from '../schemas/BookCopySchema.js';
import type { IEntityService } from './interfaces/IEntityService.js';

const em = orm.em;

export class BookCopyService
	implements IEntityService<BookCopy, BookCopyInput>
{
	async getById(id: number): Promise<BookCopy | null> {
		try {
			return await em.findOneOrFail(BookCopy, { id }, { populate: ['book'] });
		} catch (e) {
			console.error(`error getById: ${e}`);
			if (e instanceof NotFoundError) {
				return null;
			}
			throw e;
		}
	}

	async getAll(): Promise<BookCopy[]> {
		try {
			return await em.find(BookCopy, {}, { populate: ['book'] });
		} catch (e) {
			console.error(`error getAll: ${e}`);
			return [];
		}
	}

	async create(input: BookCopyInput): Promise<BookCopy> {
		try {
			const copy = new BookCopy();
			copy.is_available = input.is_available;
			copy.condition = input.condition;
			copy.book = em.getReference(Book, input.book.id);
			em.create(BookCopy, copy);
			await em.flush();
			return copy;
		} catch (e) {
			console.error(`error create: ${e}`);
			throw e;
		}
	}

	async update(input: BookCopyInput): Promise<boolean> {
		try {
			const toUpdate = await this.getById(input.id);
			if (!toUpdate) {
				return false;
			}
			const copy = new BookCopy();
			copy.is_available = input.is_available;
			copy.condition = input.condition;
			copy.book = em.getReference(Book, input.book.id);
			em.assign(toUpdate, copy);
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
