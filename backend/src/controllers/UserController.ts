import type { NextFunction, Request, Response } from 'express';
import type { UserInput } from '../schemas/UserSchema.js';
import { UserService } from '../services/UserService.js';

const userService = new UserService();

export const getUser = async (
	_req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const users = await userService.getAll();
		return res.json(users);
	} catch (e) {
		next(e);
	}
};

export const getUserById = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const id = parseInt(req.params.id, 10);
		const user = await userService.getById(id);
		if (!user) return res.status(404).json({ message: 'User not found' });
		return res.status(200).json(user);
	} catch (e) {
		next(e);
	}
};

export const createUser = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const input = req.body.sanitizedInput as UserInput;
		const user = await userService.create(input);
		const publicUser = {
			id: user.id,
			username: user.username,
			person: user.person,
		};
		return res.status(201).json(publicUser);
	} catch (e) {
		next(e);
	}
};

export const updateUser = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const id = parseInt(req.params.id, 10);
		const input = req.body.sanitizedInput as UserInput;
		if (id !== input.id) {
			return res.status(400).json({ message: 'Id mismatch' });
		}
		const updated = await userService.update(input);
		if (!updated) return res.status(404).json({ message: 'User not found' });
		return res.status(204).json();
	} catch (e) {
		next(e);
	}
};

export const deleteUser = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const id = parseInt(req.params.id, 10);
		const deleted = await userService.delete(id);
		if (!deleted) return res.status(404).json({ message: 'User not found' });
		return res.status(204).json({ message: 'User deleted' });
	} catch (e) {
		next(e);
	}
};
