import { Router } from 'express';
import {
	getUser,
	getUserById,
	createUser,
	updateUser,
	deleteUser,
} from '../controllers/UserController.js';
import { validateBody } from '../middlewares/validateBody.js';
import { validateUniqueUsername } from '../middlewares/validateUniqueUsername.js';
import { UserSchema } from '../schemas/UserSchema.js';

const router = Router();
router.get('/', getUser);
router.get('/:id', getUserById);
router.post('/', validateBody(UserSchema), validateUniqueUsername, createUser);
router.put(
	'/:id',
	validateBody(UserSchema),
	validateUniqueUsername,
	updateUser,
);
router.delete('/:id', deleteUser);
export default router;
