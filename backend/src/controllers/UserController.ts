import type { Request, Response } from 'express';
import type { UserInput } from '../schemas/UserSchema.js';
import { UserService } from '../services/UserService.js';

const userService = new UserService();

export const getUser = async (_req: Request, res: Response) => {
	try {
		const users = await userService.getAll();
		return res.json(users);
	} catch {
		return res.status(500).json({ message: 'internal error' });
	}
};

export const getUserById = async (req: Request, res: Response) => {
	try {
		const id = parseInt(req.params.id, 10);
		const user = await userService.getById(id);
		if (!user) return res.status(404).json({ message: 'User not found' });
		return res.status(200).json(user);
	} catch {
		return res.status(500).json({ message: 'internal error' });
	}
};

export const createUser = async (req: Request, res: Response) => {
	try {
		const input = req.body.sanitizedInput as UserInput;
		const user = await userService.create(input);
        const publicUser = {id: user.id,username: user.username, person: user.person};
		return res.status(201).json(publicUser);
	} catch {
		return res.status(500).json({ message: 'internal error' });
	}
};

export const updateUser = async (req: Request, res: Response) => {
	try {
		const id = parseInt(req.params.id, 10);
		const input = req.body.sanitizedInput as UserInput;
		if (id !== input.id) {
			return res.status(400).json({ message: 'Id mismatch' });
		}
		const updated = await userService.update(input);
		if (!updated) return res.status(404).json({ message: 'User not found' });
		return res.status(204).json({ message: 'User updated successfully' });
	} catch {
		return res.status(500).json({ message: 'internal error' });
	}
};

export const deleteUser = async (req: Request, res: Response) => {
	try {
		const id = parseInt(req.params.id, 10);
		const deleted = await userService.delete(id);
		if (!deleted) return res.status(404).json({ message: 'User not found' });
		return res.status(204).json({ message: 'User deleted' });
	} catch {
		return res.status(500).json({ message: 'internal error' });
	}
};
