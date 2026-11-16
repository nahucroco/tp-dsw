import { AppError } from './AppError.js';

export class ValidationError extends AppError {
	public readonly errors?: unknown[];
	constructor(message: string, errors?: unknown[]) {
		super(message, 400);
		this.errors = errors;
	}
}
