import type { NextFunction, Request, Response } from 'express';
import { orm } from '../data/orm.js';
import { User } from '../models/User.js';

export async function validateUniqueUsername(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const { username } = req.body;

	try {
		const existingUsername = await orm.em.findOne(User, {
			username,
		});

		if (existingUsername) {
			return res.status(400).json({
				message: 'The username already exists',
				field: 'username',
			});
		}
		next();
	} catch (e) {
		console.error(`unexpected error: here ${e}`);
		return res.status(500).json({ message: 'internal error' });
	}
}
