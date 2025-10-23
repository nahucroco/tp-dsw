import { z } from 'zod';
import type { User } from '../models/User.js';

const noEmpy = z
	.string()
	.min(1)
	.refine((x) => x.trim().length > 0, { error: 'the field cannot be empty' });
const UserSchema = z.object({
	//id: z.number(),
	fullName: noEmpy,
	username: noEmpy,
	password: noEmpy,
	email: z.email(),
});
function validateUser(obj: User) {
	return UserSchema.safeParse(obj);
}
export { validateUser };
