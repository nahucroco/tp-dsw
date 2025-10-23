import { NotFoundError } from '@mikro-orm/core';
import { orm } from '../data/orm.js';
import { Author } from '../models/Author.js';
import type { AuthorInput } from '../schemas/AuthorSchema.js';
import type { IEntityService } from './interfaces/IEntityService.js';

const em = orm.em;
export class AuthorService implements IEntityService<Author, AuthorInput> {
	async getById(id: number): Promise<Author | null> {
		try {
			return await em.findOneOrFail(Author, { id: id });
		} catch (e) {
			console.error(`error getById: ${e}`);
			if (e instanceof NotFoundError) {
				return null;
			}
			throw e;
		}
	}
	async getAll(): Promise<Author[]> {
		try {
			return await em.find(Author, {});
		} catch (e) {
			console.error(`error getAll: ${e}`);
			return [];
		}
	}
	async create(input: { id: number; name: string }): Promise<Author> {
		try {
			const author = new Author();
			author.id = input.id;
			author.name = input.name;
			em.create(Author, author);
			await em.flush();
			return author;
		} catch (e) {
			console.error(`error create: ${e}`);
			throw e;
		}
	}
	async update(input: { id: number; name: string }): Promise<boolean> {
		try {
			const author = new Author();
			author.id = input.id;
			author.name = input.name;
			const toUpdate = await this.getById(author.id);
			if (!toUpdate) {
				return false;
			}
			em.assign(toUpdate, author);
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
			console.error(`error delete: ${e}`);
			throw e;
		}
	}
}
