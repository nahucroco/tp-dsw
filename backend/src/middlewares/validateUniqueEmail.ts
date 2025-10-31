import type { NextFunction, Request, Response } from 'express';
import { orm } from '../data/orm.js';
import { Person } from '../models/Person.js';

const em = orm.em;

export async function validateUniqueEmail(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		// 1) Body validado por Zod si existe
		const input = (req.body?.sanitizedInput ?? req.body) as Partial<Person>;

		if (!input?.emailAddress) {
			return res
				.status(400)
				.json({ message: 'emailAddress is required', field: 'emailAddress' });
		}

		// 2) Normalizar email
		const email = String(input.emailAddress).trim().toLowerCase();

		// 3) ID (params o body)
		const paramId = Number.isFinite(+req.params?.id)
			? +req.params.id
			: undefined;
		const bodyId = typeof input.id === 'number' ? input.id : undefined;
		const id = paramId ?? bodyId;

		// 4) Si es PUT y el email no cambió, dejar pasar
		if (id && req.method !== 'POST') {
			const current = await em.findOne(Person, { id });
			if (!current)
				return res.status(404).json({ message: 'Person not found' });

			const currentEmail = (current.emailAddress ?? '').trim().toLowerCase();
			if (currentEmail === email) {
				req.body.sanitizedInput = {
					...(req.body.sanitizedInput ?? input),
					emailAddress: email,
					id,
				};
				return next();
			}
		}

		// 5) Buscar alguien con ese email
		const exists = await em.findOne(Person, { emailAddress: email });

		// ✅ si existe y NO soy yo => duplicado
		if (exists && (!id || exists.id !== id)) {
			return res
				.status(400)
				.json({ message: 'The email already exists', field: 'emailAddress' });
		}

		// 6) Reinyectar normalizado (y id si lo tenemos)
		req.body.sanitizedInput = {
			...(req.body.sanitizedInput ?? input),
			emailAddress: email,
			...(id ? { id } : {}),
		};
		next();
	} catch (e) {
		console.error('validateUniqueEmail error:', e);
		return res.status(500).json({ message: 'internal error' });
	}
}
