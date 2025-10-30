import { NotFoundError } from '@mikro-orm/core';
import { orm } from '../data/orm.js';
import { Publisher } from '../models/Publisher.js';
import type { PublisherInput } from '../schemas/PublisherSchema.js';
import type { IEntityService } from './interfaces/IEntityService.js';

const em = orm.em;

export class PublisherService
	implements IEntityService<Publisher, PublisherInput>
{
	async getById(id: number): Promise<Publisher | null> {
		try {
			return await em.findOneOrFail(Publisher, { id }, { populate: ['books'] });
		} catch (e) {
			console.error(`error getById: ${e}`);
			if (e instanceof NotFoundError) return null;
			throw e;
		}
	}

	async getAll(): Promise<Publisher[]> {
		try {
			return await em.find(Publisher, {}, { populate: ['books'] });
		} catch (e) {
			console.error(`error getAll: ${e}`);
			return [];
		}
	}

	async create(input: PublisherInput): Promise<Publisher> {
		try {
			const publisher = new Publisher();
			publisher.name = input.name;
			em.create(Publisher, publisher);
			await em.flush();
			return publisher;
		} catch (e) {
			console.error(`error create: ${e}`);
			throw e;
		}
	}

	async update(input: PublisherInput): Promise<boolean> {
		try {
			const toUpdate = await this.getById(input.id);
			if (!toUpdate) return false;

			const updated = new Publisher();
			updated.name = input.name;

			em.assign(toUpdate, updated);
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
			if (!toDelete) return false;
			await em.removeAndFlush(toDelete);
			return true;
		} catch (e) {
			console.error(`error deleting: ${e}`);
			throw e;
		}
	}
}
