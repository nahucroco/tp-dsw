import type { NextFunction, Request, Response } from 'express';
import type { PublisherInput } from '../schemas/PublisherSchema.js';
import { PublisherService } from '../services/PublisherService.js';

const publisherService = new PublisherService();

export const getPublisher = async (
	_req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const publishers = await publisherService.getAll();
		return res.json(publishers);
	} catch (e) {
		next(e);
	}
};

export const getPublisherById = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const id = parseInt(req.params.id, 10);
		const publisher = await publisherService.getById(id);
		if (!publisher)
			return res.status(404).json({ message: 'Publisher not found' });
		return res.status(200).json(publisher);
	} catch (e) {
		next(e);
	}
};

export const createPublisher = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const input = req.body.sanitizedInput as PublisherInput;
		const publisher = await publisherService.create(input);
		return res.status(201).json(publisher);
	} catch (e) {
		next(e);
	}
};

export const updatePublisher = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const id = parseInt(req.params.id, 10);
		const input = req.body.sanitizedInput as PublisherInput;
		if (id !== input.id) {
			return res.status(400).json({ message: 'Id mismatch' });
		}
		const updated = await publisherService.update(input);
		if (!updated)
			return res.status(404).json({ message: 'Publisher not found' });
		return res.status(204).json();
	} catch (e) {
		next(e);
	}
};

export const deletePublisher = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const id = parseInt(req.params.id, 10);
		const deleted = await publisherService.delete(id);
		if (!deleted)
			return res.status(404).json({ message: 'Publisher not found' });
		return res.status(204).json();
	} catch (e) {
		next(e);
	}
};
