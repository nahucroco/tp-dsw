import { z } from 'zod';

const noEmpty = z
	.string()
	.min(1)
	.refine((x) => x.trim().length > 0, {
		message: 'the field cannot be empty',
	});

const PublisherSchema = z.object({
	id: z.number().int(),
	name: noEmpty,
});

export type PublisherInput = z.infer<typeof PublisherSchema>;
export { PublisherSchema };
