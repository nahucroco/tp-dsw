import type { FilterQuery } from '@mikro-orm/core';
import type { NextFunction, Request, Response } from 'express';
import { orm } from '../data/orm.js';
import { Person } from '../models/Person.js';

const em = orm.em;

export async function validateUniqueEmail(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const { emailAddress, id } = req.body;
		const where: FilterQuery<Person> = {
			emailAddress: emailAddress.toLowerCase(),
		};
		if (id > 0) {
			where.id = { $ne: id };
		}
		const exists = await em.findOne(Person, where);
		if (exists) {
			return res.status(409).json({ error: 'Email already in use' });
		}
		next();
	} catch (e) {
		console.error('validateUniqueEmail error:', e);
		return res.status(500).json({ message: 'internal error' });
	}
}
