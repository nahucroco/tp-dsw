import type { Request, Response } from 'express';
import type { PersonInput } from '../schemas/PersonSchema.js';
import { PersonService } from '../services/PersonService.js';

const personService = new PersonService();

export const getPerson = async (_req: Request, res: Response) => {
	try {
		const people = await personService.getAll();
		return res.json(people);
	} catch {
		return res.status(500).json({ message: 'internal error' });
	}
};

export const getPersonById = async (req: Request, res: Response) => {
	try {
		const id = parseInt(req.params.id, 10);
		const person = await personService.getById(id);
		if (!person) return res.status(404).json({ message: 'Person not found' });
		return res.status(200).json(person);
	} catch {
		return res.status(500).json({ message: 'internal error' });
	}
};

export const createPerson = async (req: Request, res: Response) => {
	try {
		const input = req.body.sanitizedInput as PersonInput;
		const person = await personService.create(input);
		return res.status(201).json(person);
	} catch {
		return res.status(500).json({ message: 'internal error' });
	}
};

export const updatePerson = async (req: Request, res: Response) => {
	try {
		const id = parseInt(req.params.id, 10);
		const input = req.body.sanitizedInput as PersonInput;
		if (id !== input.id) {
			return res.status(400).json({ message: 'Id mismatch' });
		}
		const updated = await personService.update(input);
		if (!updated) return res.status(404).json({ message: 'Person not found' });
		return res.status(204).json({ message: 'Person updated successfully' });
	} catch {
		return res.status(500).json({ message: 'internal error' });
	}
};

export const deletePerson = async (req: Request, res: Response) => {
	try {
		const id = parseInt(req.params.id, 10);
		const deleted = await personService.delete(id);
		if (!deleted) return res.status(404).json({ message: 'Person not found' });
		return res.status(204).json({ message: 'Person deleted' });
	} catch {
		return res.status(500).json({ message: 'internal error' });
	}
};
