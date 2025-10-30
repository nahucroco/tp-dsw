import { z } from 'zod';

const UserSchema = z.object({
	id: z.number().int(),
	username: z.string().min(1),
	password: z
		.string()
		.min(6)
		.regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
		.regex(/[a-z]/, 'Password must contain at least one lowercase letter')
		.regex(/[0-9]/, 'Password must contain at least one number'),
	person: z.object({
		id: z.number().int().positive(),
	}),
});

export type UserInput = z.infer<typeof UserSchema>;

export { UserSchema };
