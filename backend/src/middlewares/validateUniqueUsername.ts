import type { FilterQuery } from '@mikro-orm/core';
import type { NextFunction, Request, Response } from 'express';
import { orm } from '../data/orm.js';

import { User } from '../models/User.js';

const em = orm.em;

export async function validateUniqueUsername(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const { username, id } = req.body;
		const where: FilterQuery<User> = {
			username: username,
		};
		if (id > 0) {
			where.id = { $ne: id };
		}
		const exists = await em.findOne(User, where);
		if (exists) {
			return res.status(409).json({ error: 'Username already in use' });
		}
		next();
	} catch (e) {
		console.error('validateUniqueUsername error:', e);
		return res.status(500).json({ message: 'internal error' });
	}
}
