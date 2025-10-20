import { z } from 'zod';
import type { Book } from '../models/Book.js';

const noEmpty = z
	.string()
	.min(1)
	.refine((x) => x.trim().length > 0, { error: 'the field cannot be empty' });
const BookSchema = z.object({
	code: z.number().int().positive(),
	name: noEmpty,
	author: noEmpty,
	gender: noEmpty,
	is_available: z.boolean(),
});
function validateBook(obj: Book) {
	return BookSchema.safeParse(obj);
}

export { validateBook, BookSchema };
