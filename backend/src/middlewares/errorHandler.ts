import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/AppError.js';
import { ValidationError } from '../errors/ValidationError.js';
import { ForeignKeyConstraintViolationException } from '@mikro-orm/core';

export function errorHandler(
	e: unknown,
	req: Request,
	res: Response,
	_next: NextFunction,
) {
	console.error('ERROR:', e);
	if (e instanceof ValidationError) {
		return res.status(e.statusCode).json({
			error: e.message,
			errors: e.errors,
		});
	}

	if (e instanceof AppError) {
		return res.status(e.statusCode).json({
			error: e.message,
		});
	}
	if (e instanceof ForeignKeyConstraintViolationException) {
		if (req.method === 'DELETE') {
			return res.status(409).json({
				error: 'Cannot delete entity because it has dependent records',
			});
		}
		return res.status(404).json({
			error: 'Related entity not found',
		});
	}
	return res.status(500).json({
		error: 'Internal server error',
	});
}
