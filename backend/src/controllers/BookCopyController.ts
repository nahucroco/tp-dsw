import type { NextFunction, Request, Response } from 'express';
import type { BookCopyInput } from '../schemas/BookCopySchema.js';
import { BookCopyService } from '../services/BookCopyService.js';

const bookCopyService = new BookCopyService();

export const getBookCopy = async (
	_req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const copies = await bookCopyService.getAll();
		return res.json(copies);
	} catch (e) {
		next(e);
	}
};

export const getBookCopyById = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const id = parseInt(req.params.id, 10);
		const copy = await bookCopyService.getById(id);
		return res.status(200).json(copy);
	} catch (e) {
		next(e);
	}
};

export const createBookCopy = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const input = req.body.sanitizedInput as BookCopyInput;
		const copy = await bookCopyService.create(input);
		return res.status(201).json(copy);
	} catch (e) {
		next(e);
	}
};

export const updateBookCopy = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const input = req.body.sanitizedInput as BookCopyInput;
		input.id = parseInt(req.params.id, 10);
		await bookCopyService.update(input);
		return res.sendStatus(204);
	} catch (e) {
		next(e);
	}
};

export const deleteBookCopy = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const id = parseInt(req.params.id, 10);
		await bookCopyService.delete(id);
		return res.sendStatus(204);
	} catch (e) {
		next(e);
	}
};
