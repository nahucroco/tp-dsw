import type { NextFunction, Request, Response } from 'express';
import type { LoanInput } from '../schemas/LoanSchema.js';
import { LoanService } from '../services/LoanService.js';

const loanService = new LoanService();

export const getLoan = async (
	_req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const loans = await loanService.getAll();
		return res.json(loans);
	} catch (e) {
		next(e);
	}
};

export const getLoanById = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const id = parseInt(req.params.id, 10);
		const loan = await loanService.getById(id);
		return res.status(200).json(loan);
	} catch (e) {
		next(e);
	}
};

export const createLoan = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const input = req.body.sanitizedInput as LoanInput;
		const loan = await loanService.create(input);
		return res.status(201).json(loan);
	} catch (e) {
		next(e);
	}
};

export const updateLoan = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const input = req.body.sanitizedInput as LoanInput;
		input.id = parseInt(req.params.id, 10);
		await loanService.update(input);
		return res.sendStatus(204);
	} catch (e) {
		next(e);
	}
};

export const deleteLoan = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const id = parseInt(req.params.id, 10);
		await loanService.delete(id);
		return res.sendStatus(204);
	} catch (e) {
		next(e);
	}
};
