import { z } from 'zod';
import { BookCondition } from '../enums/BookCondition.js';

const BookCopySchema = z.object({
	id: z.number().int().positive(),
	is_available: z.boolean(),
	condition: z.enum(BookCondition),
	book: z.object({
		id: z.number().int().positive(),
	}),
});

export type BookCopyInput = z.infer<typeof BookCopySchema>;
export { BookCopySchema };
