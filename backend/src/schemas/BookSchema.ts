import { z } from 'zod';

const noEmpty = z
	.string()
	.min(1)
	.refine((x) => x.trim().length > 0, { error: 'the field cannot be empty' });
const BookSchema = z.object({
	id: z.number().int(),
	title: noEmpty,
	author: z.object({
		id: z.number().int().positive(),
	}),
	gender: z.object({
		id: z.number().int().positive(),
	}),
	publisher: z.object({
		id: z.number().int().positive(),
	}),
});
export type BookInput = z.infer<typeof BookSchema>;
export { BookSchema };
