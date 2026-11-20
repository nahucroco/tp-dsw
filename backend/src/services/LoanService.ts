import { ConflictError } from '../errors/ConflictError.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { orm } from '../infrastructure/orm.js';
import { BookCopy } from '../models/BookCopy.js';
import { Loan } from '../models/Loan.js';
import { Person } from '../models/Person.js';
import type { LoanInput } from '../schemas/LoanSchema.js';
import type { IEntityService } from './interfaces/IEntityService.js';

const em = orm.em;

export class LoanService implements IEntityService<Loan, LoanInput> {
	async getById(id: number): Promise<Loan> {
		const loan = await em.findOne(
			Loan,
			{ id },
			{ populate: ['person', 'bookCopies'] },
		);
		if (!loan) {
			throw new NotFoundError('Loan not found');
		}
		return loan;
	}

	async getAll(): Promise<Loan[]> {
		return await em.find(Loan, {}, { populate: ['person', 'bookCopies'] });
	}

	async create(input: LoanInput): Promise<Loan> {
		const loan = new Loan();
		loan.startDate = input.start_date;
		loan.endDate = input.end_date;
		loan.person = em.getReference(Person, input.person.id);
		const ids = input.bookCopies.map((bookCopy) => bookCopy.id);
		const copies = await em.find(BookCopy, {
			id: { $in: ids },
		});
		for (const copy of copies) {
			if (!copy.is_available)
				throw new ConflictError('Book copy not available');
			copy.is_available = false;
			loan.bookCopies.add(copy);
		}
		em.create(Loan, loan);
		await em.flush();
		return loan;
	}

	async update(input: LoanInput): Promise<void> {
		const loan = await this.getById(input.id);
		loan.startDate = input.start_date;
		loan.endDate = input.end_date;
		loan.person = em.getReference(Person, input.person.id);
		await this.enableCopiesToUpdate(loan);
		const ids = input.bookCopies.map((bookCopy) => bookCopy.id);
		const copies = await em.find(BookCopy, {
			id: { $in: ids },
		});
		for (const copy of copies) {
			if (!copy.is_available)
				throw new ConflictError('Book copy not available');
			copy.is_available = false;
			loan.bookCopies.add(copy);
		}

		await em.flush();
	}

	async delete(id: number): Promise<void> {
		const loan = await this.getById(id);

		for (const copyRef of loan.bookCopies) {
			copyRef.is_available = true;
		}
		await em.remove(loan).flush();
	}
	async enableCopiesToUpdate(toUpdate: Loan): Promise<void> {
		for (const copyRef of toUpdate.bookCopies) {
			copyRef.is_available = true;
		}
		await em.flush();
	}
}
