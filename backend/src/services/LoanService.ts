import { NotFoundError } from '@mikro-orm/core';
import { orm } from '../data/orm.js';
import { Loan } from '../models/Loan.js';
import { Person } from '../models/Person.js';
import { BookCopy } from '../models/BookCopy.js';
import type { LoanInput } from '../schemas/LoanSchema.js';
import type { IEntityService } from './interfaces/IEntityService.js';

const em = orm.em;

export class LoanService implements IEntityService<Loan, LoanInput> {
	async getById(id: number): Promise<Loan | null> {
		try {
			return await em.findOneOrFail(
				Loan,
				{ id },
				{ populate: ['person', 'bookCopies'] },
			);
		} catch (e) {
			console.error(`error getById: ${e}`);
			if (e instanceof NotFoundError) {
				return null;
			}
			throw e;
		}
	}

	async getAll(): Promise<Loan[]> {
		try {
			return await em.find(Loan, {}, { populate: ['person', 'bookCopies'] });
		} catch (e) {
			console.error(`error getAll: ${e}`);
			return [];
		}
	}

	async create(input: LoanInput): Promise<Loan> {
		try {
			const loan = new Loan();
			loan.startDate = input.start_date;
			loan.endDate = input.end_date;
			loan.person = em.getReference(Person, input.person.id);

			for (const copyRef of input.bookCopies) {
				const copy = await em.findOneOrFail(BookCopy, { id: copyRef.id });
				copy.is_available = false;
				loan.bookCopies.add(copy);
			}

			em.create(Loan, loan);
			await em.flush();
			return loan;
		} catch (e) {
			console.error(`error create: ${e}`);
			throw e;
		}
	}

	async update(input: LoanInput): Promise<boolean> {
		try {
			const toUpdate = await this.getById(input.id);
			if (!toUpdate) return false;

			toUpdate.startDate = input.start_date;
			toUpdate.endDate = input.end_date;
			toUpdate.person = em.getReference(Person, input.person.id);

			toUpdate.bookCopies.removeAll();
			for (const copyRef of input.bookCopies) {
				const copy = await em.findOneOrFail(BookCopy, { id: copyRef.id });
				toUpdate.bookCopies.add(copy);
			}

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
