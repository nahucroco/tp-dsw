import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';

export function validateBody(schema: ZodType) {
	return (req: Request, res: Response, next: NextFunction) => {
		const result = schema.safeParse(req.body);
		if (!result.success) {
			const errors = result.error.issues.map((issue) => ({
				path: issue.path,
				message: issue.message,
			}));
			return res.status(400).json({
				message: 'Invalid input',
				errors,
			});
		}
		req.body.sanitizedInput = result.data;
		next();
	};
}
