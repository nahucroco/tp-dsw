import {
	ForeignKeyConstraintViolationException,
	UniqueConstraintViolationException,
} from '@mikro-orm/core';
import type { NextFunction, Request, Response } from 'express';

export function errorHandler(
	e: unknown,
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
	if (e instanceof UniqueConstraintViolationException) {
		return res.status(409).json({
			error: 'Resource already exists',
		});
	}
	return res.status(500).json({
		error: 'Internal server error',
	});
}
