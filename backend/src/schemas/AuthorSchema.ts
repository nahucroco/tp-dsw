import { z } from 'zod';

const AuthorSchema = z.object({
	id: z.number().int().positive(),
	name: z
		.string()
		.min(1)
		.refine((x) => x.trim().length > 0, { error: 'the field cannot be empty' }),
});
export type AuthorInput = z.infer<typeof AuthorSchema>;
export { AuthorSchema };
