import type { NextFunction, Request, Response } from 'express';
import { orm } from '../data/orm.js';
import { BookCopy } from '../models/BookCopy.js';
const em = orm.em;
export const validateBookCopiesAvailability = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { bookCopies } = req.body;

		if (!Array.isArray(bookCopies)) {
			return res.status(400).json({ error: 'bookCopies must be an array' });
		}

		const unavailable: number[] = [];

		for (const ref of bookCopies) {
			const copy = await em.findOne(BookCopy, { id: ref.id });
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
		console.error(`unexpected error: ${e}`);
		return res.status(500).json({ message: 'internal error' });
	}
};
