import { Router } from 'express';
import {
	createAuthor,
	deleteAuthor,
	getAuthors,
	getAuthorById,
	updateAuthor,
} from '../controllers/AuthorController.js';
import { validateBody } from '../middlewares/validateBody.js';
import { AuthorSchema } from '../schemas/AuthorSchema.js';

const router = Router();

router.get('/', getAuthors);
router.get('/:id', getAuthorById);
router.post('/', createAuthor, validateBody(AuthorSchema));
router.put('/:id', updateAuthor, validateBody(AuthorSchema));
router.delete('/:id', deleteAuthor);

export default router;
