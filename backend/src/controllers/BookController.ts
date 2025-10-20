import type { Request, Response } from 'express';
import type { z } from 'zod';
import { type BookSchema, validateBook } from '../schemas/BookSchema.js';
import { BookService } from '../services/BookService.js';

type BookInput = z.infer<typeof BookSchema>;
const bookService = new BookService();
export const getBook = async (res: Response) => {
	const books = await bookService.getAll();
	return res.json(books);
};

export const getBookById = async (req: Request, res: Response) => {
	const id = parseInt(req.params.id, 10);
	const book = await bookService.getById(id);
	if (!book) return res.status(404).json({ message: 'Book not found' });
	return res.json(book);
};

export const createBook = async (req: Request, res: Response) => {
	const input = req.body.sanitizedInput as BookInput;
	await bookService.create(input);
	return res.status(201).json(input);
};

export const updateBook = async (req: Request, res: Response) => {
	const id = parseInt(req.params.id, 10);
	const entity = req.body;
	const result = validateBook(entity);
	if (result.error) {
		return res.status(400).json({ error: JSON.parse(result.error.message) });
	}
	if (id !== entity.code) {
		return res.status(400).json({ message: 'Id mismatch' });
	}
	const updated = await bookService.update(entity);
	if (!updated) return res.status(404).json({ message: 'Book not found' });
	return res.status(204).json(updated);
};

export const deleteBook = async (req: Request, res: Response) => {
	const id = parseInt(req.params.id, 10);
	const deleted = await bookService.delete(id);
	if (!deleted) return res.status(404).json({ message: 'Book not found' });
	return res.json({ message: 'Book deleted' });
};
