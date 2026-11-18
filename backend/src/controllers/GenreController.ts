import type { NextFunction, Request, Response } from 'express';
import type { GenreInput } from '../schemas/GenreSchema.js';
import { GenreService } from '../services/GenreService.js';

const genreService = new GenreService();

export const getGenres = async (
	_req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const genres = await genreService.getAll();
		return res.json(genres);
	} catch (e) {
		next(e);
	}
};

export const getGenreById = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const id = parseInt(req.params.id, 10);
		const genre = await genreService.getById(id);
		return res.status(200).json(genre);
	} catch (e) {
		next(e);
	}
};

export const createGenre = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const input = req.body.sanitizedInput as GenreInput;
		const genre = await genreService.create(input);
		return res.status(201).json(genre);
	} catch (e) {
		next(e);
	}
};

export const updateGenre = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const input = req.body.sanitizedInput as GenreInput;
		input.id = parseInt(req.params.id, 10);
		await genreService.update(input);
		return res.sendStatus(204);
	} catch (e) {
		next(e);
	}
};

export const deleteGenre = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const id = parseInt(req.params.id, 10);
		await genreService.delete(id);
		return res.sendStatus(204);
	} catch (e) {
		next(e);
	}
};
