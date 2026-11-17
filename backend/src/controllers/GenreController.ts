import e from 'cors';
import type { NextFunction, Request, Response } from 'express';
import type { GenreInput } from '../schemas/GenreSchema.js';
import { GenreService } from '../services/GenreService.js';

const genderService = new GenreService();

export const getGenders = async (
	_req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const genders = await genderService.getAll();
		return res.json(genders);
	} catch (_e) {
		next(e);
	}
};

export const getGenderById = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const id = parseInt(req.params.id, 10);
		const gender = await genderService.getById(id);
		if (!gender) return res.status(404).json({ message: 'Gender not found' });
		return res.status(200).json(gender);
	} catch (e) {
		next(e);
	}
};

export const createGender = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const input = req.body.sanitizedInput as GenreInput;
		const gender = await genderService.create(input);
		return res.status(201).json(gender);
	} catch (e) {
		next(e);
	}
};

export const updateGender = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const id = parseInt(req.params.id, 10);
		const input = req.body.sanitizedInput as GenreInput;
		if (id !== input.id) {
			return res.status(400).json({ message: 'Id mismatch' });
		}
		const updated = await genderService.update(input);
		if (!updated) return res.status(404).json({ message: 'Gender not found' });
		return res.status(204).json();
	} catch (e) {
		next(e);
	}
};

export const deleteGender = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const id = parseInt(req.params.id, 10);
		const deleted = await genderService.delete(id);
		if (!deleted) return res.status(404).json({ message: 'Gender not found' });
		return res.status(204).json();
	} catch (e) {
		next(e);
	}
};
