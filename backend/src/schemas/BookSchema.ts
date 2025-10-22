import { z } from 'zod';
import type { Book } from '../models/Book.js';

const noEmpty = z
	.string()
	.min(1)
	.refine((x) => x.trim().length > 0, { error: 'the field cannot be empty' });
const BookSchema = z.object({
	id: z.number().int().positive(),
	title: noEmpty,
	author: z.object({
		id: z.number().int().positive(),
	}),
	gender: z.object({
		id: z.number().int().positive(),
	}),
});
function validateBook(obj: Book) {
	return BookSchema.safeParse(obj);
}
export type BookInput = z.infer<typeof BookSchema>;
export { validateBook, BookSchema };
