import { NotFoundError } from '@mikro-orm/core';
import { orm } from '../data/orm.js';
import { Gender } from '../models/Gender.js';
import type { IEntityService } from './interfaces/IEntityService.js';

const em = orm.em;
export class GenderService implements IEntityService<Gender> {
	async getById(id: number): Promise<Gender | null> {
		try {
			return await em.findOneOrFail(Gender, { id });
		} catch (e) {
			console.error(`error getById: ${e}`);
			if (e instanceof NotFoundError) {
				return null;
			}
			throw e;
		}
	}

	async getAll(): Promise<Gender[]> {
		try {
			return await em.find(Gender, {});
		} catch (e) {
			console.error(`error getAll: ${e}`);
			return [];
		}
	}

	async create(entity: Gender): Promise<void> {
		try {
			em.create(Gender, entity);
			await em.flush();
		} catch (e) {
			console.error(`error create: ${e}`);
			throw e;
		}
	}

	async update(entity: Gender): Promise<boolean> {
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
