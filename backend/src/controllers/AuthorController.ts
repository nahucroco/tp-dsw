import type { NextFunction, Request, Response } from 'express';
import type { AuthorInput } from '../schemas/AuthorSchema.js';
import { AuthorService } from '../services/AuthorService.js';

const authorService = new AuthorService();

export const getAuthors = async (
	_req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const authors = await authorService.getAll();
		return res.json(authors);
	} catch (e) {
		next(e);
	}
};

export const getAuthorById = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const id = parseInt(req.params.id, 10);
		const author = await authorService.getById(id);
		if (!author) return res.status(404).json({ message: 'Author not found' });
		return res.status(200).json(author);
	} catch (e) {
		next(e);
	}
};

export const createAuthor = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const input = req.body.sanitizedInput as AuthorInput;
		const author = await authorService.create(input);
		return res.status(201).json(author);
	} catch (e) {
		next(e);
	}
};

export const updateAuthor = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const id = parseInt(req.params.id, 10);
		const input = req.body.sanitizedInput as AuthorInput;
		if (id !== input.id) {
			return res.status(400).json({ message: 'Id mismatch' });
		}
		const updated = await authorService.update(input);
		if (!updated) return res.status(404).json({ message: 'Author not found' });
		return res.status(204).json({ message: 'Author updated successfully' });
	} catch (e) {
		next(e);
	}
};

export const deleteAuthor = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const id = parseInt(req.params.id, 10);
		const deleted = await authorService.delete(id);
		if (!deleted) return res.status(404).json({ message: 'Author not found' });
		return res.status(204).json({ message: 'Author deleted' });
	} catch (e) {
		next(e);
	}
};
