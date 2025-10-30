import type { Request, Response } from 'express';
import type { LoanInput } from '../schemas/LoanSchema.js';
import { LoanService } from '../services/LoanService.js';

const loanService = new LoanService();

export const getLoan = async (_req: Request, res: Response) => {
	const loans = await loanService.getAll();
	return res.json(loans);
};

export const getLoanById = async (req: Request, res: Response) => {
	try {
		const id = parseInt(req.params.id, 10);
		const loan = await loanService.getById(id);
		if (!loan) return res.status(404).json({ message: 'Loan not found' });
		return res.status(200).json(loan);
	} catch (_e) {
		return res.status(500).json({ message: 'internal error' });
	}
};

export const createLoan = async (req: Request, res: Response) => {
	try {
		const input = req.body.sanitizedInput as LoanInput;
		const loan = await loanService.create(input);
		return res.status(201).json(loan);
	} catch (_e) {
		return res.status(500).json({ message: 'internal error' });
	}
};

export const updateLoan = async (req: Request, res: Response) => {
	try {
		const id = parseInt(req.params.id, 10);
		const input = req.body.sanitizedInput as LoanInput;
		if (id !== input.id) {
			return res.status(400).json({ message: 'Id mismatch' });
		}
		const updated = await loanService.update(input);
		if (!updated) return res.status(404).json({ message: 'Loan not found' });
		return res.status(204).json({ message: 'Loan updated successfully' });
	} catch (_e) {
		return res.status(500).json({ message: 'internal error' });
	}
};

export const deleteLoan = async (req: Request, res: Response) => {
	try {
		const id = parseInt(req.params.id, 10);
		const deleted = await loanService.delete(id);
		if (!deleted) return res.status(404).json({ message: 'Loan not found' });
		return res.status(204).json({ message: 'Loan deleted' });
	} catch (_e) {
		return res.status(500).json({ message: 'internal error' });
	}
};
