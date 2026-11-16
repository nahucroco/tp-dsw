import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';
import { ValidationError } from '../errrors/ValidationError.js';

export function validateBody(schema: ZodType) {
	return (req: Request, _res: Response, next: NextFunction) => {
		const result = schema.safeParse(req.body);
		if (!result.success) {
			return next(
				new ValidationError(
					'Invalid input',
					result.error.issues.map((issue) => ({
						path: issue.path,
						message: issue.message,
					})),
				),
			);
		}
		req.body.sanitizedInput = result.data;
		next();
	};
}
