import { ForeignKeyConstraintViolationException } from '@mikro-orm/core';
import type { NextFunction, Request, Response } from 'express';

export function errorHandler(
	// biome-ignore lint/suspicious/noExplicitAny: <ni idea>
	e: any,
	_req: Request,
	res: Response,
	_next: NextFunction,
) {
	console.error('ERROR:', e);

	if (e instanceof ForeignKeyConstraintViolationException) {
		console.error(e.message);
		return res.status(400).json({
			error: 'Invalid reference: related entity not found',
		});
	}
	return res.status(500).json({
		error: 'Internal server error',
	});
}
