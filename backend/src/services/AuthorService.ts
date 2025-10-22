import { NotFoundError } from '@mikro-orm/core';
import { orm } from '../data/orm.js';
import { Author } from '../models/Author.js';
import type { IEntityService } from './interfaces/IEntityService.js';

const em = orm.em;
export class AuthorService implements IEntityService<Author> {
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
	async create(entity: Author): Promise<void> {
		try {
			em.create(Author, entity);
			await em.flush();
		} catch (e) {
			console.error(`error create: ${e}`);
			throw e;
		}
	}
	async update(entity: Author): Promise<boolean> {
		try {
			const toUpdate = await this.getById(entity.id);
			if (!toUpdate) {
				return false;
			}
			em.assign(toUpdate, entity);
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
