import { NotFoundError } from '@mikro-orm/core';
import { orm } from '../data/orm.js';
import { Sanction } from '../models/Sanction.js';
import { Loan } from '../models/Loan.js';
import { Person } from '../models/Person.js';
import type { SanctionInput } from '../schemas/SanctionSchema.js';
import type { IEntityService } from './interfaces/IEntityService.js';

const em = orm.em;

export class SanctionService
	implements IEntityService<Sanction, SanctionInput>
{
	async getById(id: number): Promise<Sanction | null> {
		try {
			return await em.findOneOrFail(
				Sanction,
				{ id },
				{ populate: ['loan', 'infractor'] },
			);
		} catch (e) {
			console.error(`error getById: ${e}`);
			if (e instanceof NotFoundError) {
				return null;
			}
			throw e;
		}
	}

	async getAll(): Promise<Sanction[]> {
		try {
			return await em.find(Sanction, {}, { populate: ['loan', 'infractor'] });
		} catch (e) {
			console.error(`error getAll: ${e}`);
			return [];
		}
	}

	async create(input: SanctionInput): Promise<Sanction> {
		try {
			const sanction = new Sanction();
			sanction.reason = input.reason;
			sanction.loan = em.getReference(Loan, input.loan.id);
			sanction.infractor = em.getReference(Person, input.infractor.id);

			em.create(Sanction, sanction);
			await em.flush();
			return sanction;
		} catch (e) {
			console.error(`error create: ${e}`);
			throw e;
		}
	}

	async update(input: SanctionInput): Promise<boolean> {
		try {
			const toUpdate = await this.getById(input.id);
			if (!toUpdate) {
				return false;
			}

			const updated = new Sanction();
			updated.reason = input.reason;
			updated.loan = em.getReference(Loan, input.loan.id);
			updated.infractor = em.getReference(Person, input.infractor.id);

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
