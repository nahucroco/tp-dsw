import type { Request, Response } from 'express';
import type { BookCopyInput } from '../schemas/BookCopySchema.js';
import { BookCopyService } from '../services/BookCopyService.js';

const bookCopyService = new BookCopyService();

export const getBookCopy = async (_req: Request, res: Response) => {
	const copies = await bookCopyService.getAll();
	return res.json(copies);
};

export const getBookCopyById = async (req: Request, res: Response) => {
	try {
		const id = parseInt(req.params.id, 10);
		const copy = await bookCopyService.getById(id);
		if (!copy) return res.status(404).json({ message: 'Book copy not found' });
		return res.status(200).json(copy);
	} catch (_e) {
		return res.status(500).json({ message: 'internal error' });
	}
};

export const createBookCopy = async (req: Request, res: Response) => {
	try {
		const input = req.body.sanitizedInput as BookCopyInput;
		const copy = await bookCopyService.create(input);
		return res.status(201).json(copy);
	} catch (_e) {
		return res.status(500).json({ message: 'internal error' });
	}
};

export const updateBookCopy = async (req: Request, res: Response) => {
	try {
		const id = parseInt(req.params.id, 10);
		const input = req.body.sanitizedInput as BookCopyInput;
		if (id !== input.id) {
			return res.status(400).json({ message: 'Id mismatch' });
		}
		const updated = await bookCopyService.update(input);
		if (!updated)
			return res.status(404).json({ message: 'Book copy not found' });
		return res.status(204).json({ message: 'Book copy updated successfully' });
	} catch (_e) {
		return res.status(500).json({ message: 'internal error' });
	}
};

export const deleteBookCopy = async (req: Request, res: Response) => {
	try {
		const id = parseInt(req.params.id, 10);
		const deleted = await bookCopyService.delete(id);
		if (!deleted)
			return res.status(404).json({ message: 'Book copy not found' });
		return res.status(204).json({ message: 'Book copy deleted' });
	} catch (_e) {
		return res.status(500).json({ message: 'internal error' });
	}
};
