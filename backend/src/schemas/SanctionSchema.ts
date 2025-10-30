import { z } from 'zod';

const noEmpty = z
	.string()
	.min(1)
	.refine((x) => x.trim().length > 0, {
		message: 'the field cannot be empty',
	});

export const SanctionSchema = z.object({
	id: z.number().int(),
	reason: noEmpty,
	infractor: z.object({
		id: z.number().int().positive(),
	}),
	loan: z.object({
		id: z.number().int().positive(),
	}),
});

export type SanctionInput = z.infer<typeof SanctionSchema>;
