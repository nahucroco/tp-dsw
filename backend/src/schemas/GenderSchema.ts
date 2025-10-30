import { z } from 'zod';

const GenderSchema = z.object({
	id: z.number().int(),
	description: z
		.string()
		.min(1)
		.refine((x) => x.trim().length > 0, { error: 'the field cannot be empty' }),
});
export type GenderInput = z.infer<typeof GenderSchema>;
export { GenderSchema };
