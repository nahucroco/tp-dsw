import { NotFoundError } from '@mikro-orm/core';
import type { NextFunction, Request, Response } from 'express';
import { orm } from '../data/orm.js';
import { BookCopy } from '../models/BookCopy.js';
import { Loan } from '../models/Loan.js';
const em = orm.em;
export const validateBookCopiesAvailability = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { bookCopies, id: loanId } = req.body;

		if (!Array.isArray(bookCopies)) {
			return res.status(400).json({ error: 'bookCopies must be an array' });
		}
		let alreadyAssignedBookCopiesIds: number[] = [];
		if (loanId) {
			const existingLoan = await em.findOne(Loan, loanId, {
				populate: ['bookCopies'],
			});
			if (existingLoan) {
				alreadyAssignedBookCopiesIds = existingLoan.bookCopies.getIdentifiers();
			}
		}

		const unavailable: number[] = [];

		for (const ref of bookCopies) {
			if (alreadyAssignedBookCopiesIds.includes(ref.id)) continue;
			const copy = await em.findOneOrFail(BookCopy, { id: ref.id });
			if (!copy || !copy.is_available) {
				unavailable.push(ref.id);
			}
		}

		if (unavailable.length > 0) {
			return res.status(400).json({
				error: 'Some book copies are not available',
				unavailableIds: unavailable,
			});
		}

		next();
	} catch (e) {
		if (e instanceof NotFoundError) {
			console.error(`book copy doesn't exist: ${e}`);
			return res.status(400).json({ error: 'book copy doesnt exist' });
		}
		console.error(`unexpected error: ${e}`);
		return res.status(500).json({ message: 'internal error' });
	}
};
