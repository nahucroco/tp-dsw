import type { NextFunction, Request, Response } from 'express';
import { clearJWT, generateJWT } from '../infrastructure/jwtUtils.js';
import type { LoginInput } from '../schemas/LoginSchema.js';
import UserService from '../services/UserService.js';

const userService = new UserService();
export const login = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const input = req.body.sanitizedInput as LoginInput;
		const user = await userService.login(input);
		if (!user) {
			return res.status(401).json({ error: 'Invalid credentials' });
		}
		generateJWT(res, user.id, user.role);
		return res.status(200).json({ message: 'Login successful' });
	} catch (e) {
		next(e);
	}
};

export const logoutUser = async (
	_req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		clearJWT(res);
		res.status(200).json({ message: 'Logout successful' });
	} catch (e) {
		next(e);
	}
};

export const me = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const id = req.user?.userId;
		if (!id) return res.status(401).json({ error: 'Invalid credentials' });
		const currentUser = await userService.getById(id);
		if (!currentUser)
			return res.status(404).json({ message: 'User not found' });
		return res.status(200).json(currentUser);
	} catch (e) {
		next(e);
	}
};
