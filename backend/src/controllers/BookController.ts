import type { NextFunction, Request, Response } from 'express';
import type { BookInput } from '../schemas/BookSchema.js';
import { BookService } from '../services/BookService.js';

const bookService = new BookService();
export const getBook = async (
	_req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const books = await bookService.getAll();
		return res.json(books);
	} catch (e) {
		next(e);
	}
};

export const getBookById = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const id = parseInt(req.params.id, 10);
		const book = await bookService.getById(id);
		return res.status(200).json(book);
	} catch (e) {
		next(e);
	}
};

export const createBook = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const input = req.body.sanitizedInput as BookInput;
		const book = await bookService.create(input);
		return res.status(201).json(book);
	} catch (e) {
		next(e);
	}
};

export const updateBook = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const input = req.body.sanitizedInput as BookInput;
		input.id = parseInt(req.params.id, 10);
		await bookService.update(input);
		return res.sendStatus(204);
	} catch (e) {
		next(e);
	}
};

export const deleteBook = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const id = parseInt(req.params.id, 10);
		await bookService.delete(id);
		return res.sendStatus(204);
	} catch (e) {
		next(e);
	}
};
