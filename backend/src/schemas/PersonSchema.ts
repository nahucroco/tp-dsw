import { z } from 'zod';

const PersonSchema = z.object({
	id: z.number().int(),
	name: z.string().min(1),
	lastName: z.string().min(1),
	address: z.string().min(1),
	phone: z.string().min(1),
	emailAddress: z.email(),
});

export type PersonInput = z.infer<typeof PersonSchema>;

export { PersonSchema };
