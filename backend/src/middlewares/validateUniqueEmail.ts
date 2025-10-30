import type { NextFunction, Request, Response } from 'express';
import { orm } from '../data/orm.js';
import { Person } from '../models/Person.js';

export async function validateUniqueEmail(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const { emailAddress } = req.body;
	try {
		const existingEmail = await orm.em.findOne(Person, {
			emailAddress,
		});

		if (existingEmail) {
			return res.status(400).json({
				message: 'The email already exists',
				field: 'emailAddress',
			});
		}
		next();
	} catch (e) {
		console.error(`unexpected error: ${e}`);
		return res.status(500).json({ message: 'internal error' });
	}
}
