import type { Request, Response } from 'express';
import type { GenderInput } from '../schemas/GenderSchema.js';
import { GenderService } from '../services/GenderService.js';

const genderService = new GenderService();

export const getGenders = async (res: Response) => {
	try {
		const genders = await genderService.getAll();
		return res.json(genders);
	} catch (_e) {
		return res.status(500).json({ message: 'internal error' });
	}
};

export const getGenderById = async (req: Request, res: Response) => {
	try {
		const id = parseInt(req.params.id, 10);
		const gender = await genderService.getById(id);
		if (!gender) return res.status(404).json({ message: 'Gender not found' });
		return res.status(200).json(gender);
	} catch (_e) {
		return res.status(500).json({ message: 'internal error' });
	}
};

export const createGender = async (req: Request, res: Response) => {
	try {
		const input = req.body.sanitizedInput as GenderInput;
		const gender = await genderService.create(input);
		return res.status(201).json(gender);
	} catch (_e) {
		return res.status(500).json({ message: 'internal error' });
	}
};

export const updateGender = async (req: Request, res: Response) => {
	try {
		const id = parseInt(req.params.id, 10);
		const input = req.body.sanitizedInput as GenderInput;
		if (id !== input.id) {
			return res.status(400).json({ message: 'Id mismatch' });
		}
		const updated = await genderService.update(input);
		if (!updated) return res.status(404).json({ message: 'Gender not found' });
		return res.status(204).json({ message: 'Gender updated successfully' });
	} catch (_e) {
		return res.status(500).json({ message: 'internal error' });
	}
};

export const deleteGender = async (req: Request, res: Response) => {
	try {
		const id = parseInt(req.params.id, 10);
		const deleted = await genderService.delete(id);
		if (!deleted) return res.status(404).json({ message: 'Gender not found' });
		return res.status(204).json({ message: 'Gender deleted' });
	} catch (_e) {
		return res.status(500).json({ message: 'internal error' });
	}
};
