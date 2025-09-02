import type { Request, Response } from "express";
import { UserService } from "../services/UserService";

const userService = new UserService();
export const getUser = async (req: Request, res: Response) => {
	const users = await userService.getAll();
	res.json(users);
};
export const getUserById = async (req: Request, res: Response) => {
	const id = parseInt(req.params.id, 10);
	const user = await userService.getById(id);
	if (!user) res.status(404).json({ message: "User not found" });
	res.json(user);
};
export const createUser = async (req: Request, res: Response) => {
	const entity = req.body;
	await userService.create(entity);
	res.status(201).json(entity);
};
export const updateUser = async (req: Request, res: Response) => {
	const id = parseInt(req.params.id, 10);
	const entity = req.body;
	if (id !== entity.code) {
		return res.status(400).json({ message: "Id mismatch" });
	}
	const updated = await userService.update(entity);
	if (!updated) return res.status(404).json({ message: "User not found" });
	return res.status(204).json(updated);
};
export const deleteUser = async (req: Request, res: Response) => {
	const id = parseInt(req.params.id, 10);
	const deleted = await userService.delete(id);
	if (!deleted) return res.status(404).json({ message: "User not found" });
	res.json({ message: "User deleted" });
};
