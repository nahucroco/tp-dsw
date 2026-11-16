import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../errrors/AppError.js';
import { ValidationError } from '../errrors/ValidationError.js';

export function errorHandler(
	e: unknown,
	_req: Request,
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
	return res.status(500).json({
		error: 'Internal server error',
	});
}
