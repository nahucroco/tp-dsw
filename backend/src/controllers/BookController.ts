import type { Request, Response } from 'express';
import type { BookInput } from '../schemas/BookSchema.js';
import { BookService } from '../services/BookService.js';

const bookService = new BookService();
export const getBook = async (res: Response) => {
	const books = await bookService.getAll();
	return res.json(books);
};

export const getBookById = async (req: Request, res: Response) => {
	try {
		const id = parseInt(req.params.id, 10);
		const book = await bookService.getById(id);
		if (!book) return res.status(404).json({ message: 'Book not found' });
		return res.status(200).json(book);
	} catch (_e) {
		return res.status(500).json({ message: 'internal error' });
	}
};

export const createBook = async (req: Request, res: Response) => {
	try {
		const input = req.body.sanitizedInput as BookInput;
		const book = await bookService.create(input);
		return res.status(201).json(book);
	} catch (_e) {
		return res.status(500).json({ message: 'internal error' });
	}
};

export const updateBook = async (req: Request, res: Response) => {
	try {
		const id = parseInt(req.params.id, 10);
		const input = req.body.sanitizedInput as BookInput;
		if (id !== input.id) {
			return res.status(400).json({ message: 'Id mismatch' });
		}
		const updated = await bookService.update(input);
		if (!updated) return res.status(404).json({ message: 'Book not found' });
		return res.status(204).json({ message: 'Book updated successfully' });
	} catch (_e) {
		return res.status(500).json({ message: 'internal error' });
	}
};

export const deleteBook = async (req: Request, res: Response) => {
	try {
		const id = parseInt(req.params.id, 10);
		const deleted = await bookService.delete(id);
		if (!deleted) return res.status(404).json({ message: 'Book not found' });
		return res.status(204).json({ message: 'Book deleted' });
	} catch (_e) {
		return res.status(500).json({ message: 'internal error' });
	}
};
