import type { Request, Response } from 'express';
import type { SanctionInput } from '../schemas/SanctionSchema.js';
import { SanctionService } from '../services/SanctionService.js';

const sanctionService = new SanctionService();

export const getSanction = async (_req: Request, res: Response) => {
	const sanctions = await sanctionService.getAll();
	return res.json(sanctions);
};

export const getSanctionById = async (req: Request, res: Response) => {
	try {
		const id = parseInt(req.params.id, 10);
		const sanction = await sanctionService.getById(id);
		if (!sanction)
			return res.status(404).json({ message: 'Sanction not found' });
		return res.status(200).json(sanction);
	} catch (_e) {
		return res.status(500).json({ message: 'internal error' });
	}
};

export const createSanction = async (req: Request, res: Response) => {
	try {
		const input = req.body.sanitizedInput as SanctionInput;
		const sanction = await sanctionService.create(input);
		return res.status(201).json(sanction);
	} catch (_e) {
		return res.status(500).json({ message: 'internal error' });
	}
};

export const updateSanction = async (req: Request, res: Response) => {
	try {
		const id = parseInt(req.params.id, 10);
		const input = req.body.sanitizedInput as SanctionInput;
		if (id !== input.id) {
			return res.status(400).json({ message: 'Id mismatch' });
		}
		const updated = await sanctionService.update(input);
		if (!updated)
			return res.status(404).json({ message: 'Sanction not found' });
		return res.status(204).json({ message: 'Sanction updated successfully' });
	} catch (_e) {
		return res.status(500).json({ message: 'internal error' });
	}
};

export const deleteSanction = async (req: Request, res: Response) => {
	try {
		const id = parseInt(req.params.id, 10);
		const deleted = await sanctionService.delete(id);
		if (!deleted)
			return res.status(404).json({ message: 'Sanction not found' });
		return res.status(204).json({ message: 'Sanction deleted' });
	} catch (_e) {
		return res.status(500).json({ message: 'internal error' });
	}
};
