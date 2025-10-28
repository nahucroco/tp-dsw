/*
import type { Request, Response } from 'express';
import { validateUser } from '../schemas/UserSchema.js';
import { UserService } from '../services/UserService.js';

const userService = new UserService();
export const getUser = async (req: Request, res: Response) => {
	const users = await userService.getAll();
	return res.json(users);
};
export const getUserById = async (req: Request, res: Response) => {
	const id = parseInt(req.params.id, 10);
	const user = await userService.getById(id);
	if (!user) return res.status(404).json({ message: 'User not found' });
	return res.json(user);
};
export const createUser = async (req: Request, res: Response) => {
	const entity = req.body;
	const result = validateUser(entity);
	if (result.error) {
		return res.status(400).json({ error: JSON.parse(result.error.message) });
	}
	await userService.create(entity);
	return res.status(201).json(entity);
};
export const updateUser = async (req: Request, res: Response) => {
	const id = parseInt(req.params.id, 10);
	const entity = req.body;
	const result = validateUser(entity);
	if (result.error) {
		return res.status(400).json({ error: JSON.parse(result.error.message) });
	}
	if (id !== entity.code) {
		return res.status(400).json({ message: 'Id mismatch' });
	}
	if (id !== entity.code) {
		return res.status(400).json({ message: 'Id mismatch' });
	}
	const updated = await userService.update(entity);
	if (!updated) return res.status(404).json({ message: 'User not found' });
	return res.status(204).json(updated);
};
export const deleteUser = async (req: Request, res: Response) => {
	const id = parseInt(req.params.id, 10);
	const deleted = await userService.delete(id);
	if (!deleted) return res.status(404).json({ message: 'User not found' });
	return res.json({ message: 'User deleted' });
};*/
