import { z } from 'zod';

const GenreSchema = z.object({
	id: z.number().int(),
	description: z
		.string()
		.min(1)
		.refine((x) => x.trim().length > 0, { error: 'the field cannot be empty' }),
});
export type GenreInput = z.infer<typeof GenreSchema>;
export { GenreSchema };
