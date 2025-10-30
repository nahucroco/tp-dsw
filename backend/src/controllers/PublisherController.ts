import type { Request, Response } from 'express';
import type { PublisherInput } from '../schemas/PublisherSchema.js';
import { PublisherService } from '../services/PublisherService.js';

const publisherService = new PublisherService();

export const getPublisher = async (_req: Request, res: Response) => {
	const publishers = await publisherService.getAll();
	return res.json(publishers);
};

export const getPublisherById = async (req: Request, res: Response) => {
	try {
		const id = parseInt(req.params.id, 10);
		const publisher = await publisherService.getById(id);
		if (!publisher)
			return res.status(404).json({ message: 'Publisher not found' });
		return res.status(200).json(publisher);
	} catch (_e) {
		return res.status(500).json({ message: 'internal error' });
	}
};

export const createPublisher = async (req: Request, res: Response) => {
	try {
		const input = req.body.sanitizedInput as PublisherInput;
		const publisher = await publisherService.create(input);
		return res.status(201).json(publisher);
	} catch (_e) {
		return res.status(500).json({ message: 'internal error' });
	}
};

export const updatePublisher = async (req: Request, res: Response) => {
	try {
		const id = parseInt(req.params.id, 10);
		const input = req.body.sanitizedInput as PublisherInput;
		if (id !== input.id) {
			return res.status(400).json({ message: 'Id mismatch' });
		}
		const updated = await publisherService.update(input);
		if (!updated)
			return res.status(404).json({ message: 'Publisher not found' });
		return res.status(204).json({ message: 'Publisher updated successfully' });
	} catch (_e) {
		return res.status(500).json({ message: 'internal error' });
	}
};

export const deletePublisher = async (req: Request, res: Response) => {
	try {
		const id = parseInt(req.params.id, 10);
		const deleted = await publisherService.delete(id);
		if (!deleted)
			return res.status(404).json({ message: 'Publisher not found' });
		return res.status(204).json({ message: 'Publisher deleted' });
	} catch (_e) {
		return res.status(500).json({ message: 'internal error' });
	}
};
