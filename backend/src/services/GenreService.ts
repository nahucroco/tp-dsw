import { NotFoundError } from '@mikro-orm/core';
import { orm } from '../infrastructure/orm.js';
import { Genre } from '../models/Genre.js';
import type { GenreInput } from '../schemas/GenreSchema.js';
import type { IEntityService } from './interfaces/IEntityService.js';

const em = orm.em;

export class GenreService implements IEntityService<Genre, GenreInput> {
	async getById(id: number): Promise<Genre | null> {
		try {
			return await em.findOneOrFail(Genre, { id });
		} catch (e) {
			console.error(`error getById: ${e}`);
			if (e instanceof NotFoundError) {
				return null;
			}
			throw e;
		}
	}

	async getAll(): Promise<Genre[]> {
		try {
			return await em.find(Genre, {});
		} catch (e) {
			console.error(`error getAll: ${e}`);
			return [];
		}
	}

	async create(input: GenreInput): Promise<Genre> {
		try {
			const gender = new Genre();
			gender.description = input.description;
			em.create(Genre, gender);
			await em.flush();
			return gender;
		} catch (e) {
			console.error(`error create: ${e}`);
			throw e;
		}
	}

	async update(input: GenreInput): Promise<boolean> {
		try {
			const toUpdate = await this.getById(input.id);
			if (!toUpdate) {
				return false;
			}
			em.assign(toUpdate, input);
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
