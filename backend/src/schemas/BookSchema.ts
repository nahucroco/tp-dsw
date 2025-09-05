import { z } from 'zod';
import type { Book } from '../models/Book';

const noEmpy = z
	.string()
	.min(1)
	.refine((x) => x.trim().length > 0, { error: 'the field cannot be empty' });
const BookSchema = z.object({
	//code: z.number().int().positive(),
	name: noEmpy,
	author: noEmpy,
	gender: noEmpy,
	is_available: z.boolean(),
});
function validateBook(obj: Book) {
	return BookSchema.safeParse(obj);
}

export { validateBook };
