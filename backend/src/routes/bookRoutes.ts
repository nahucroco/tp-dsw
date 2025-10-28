import { Router } from 'express';
import {
	createBook,
	deleteBook,
	getBook,
	getBookById,
	updateBook,
} from '../controllers/BookController.js';
import { validateBody } from '../middlewares/validateBody.js';
import { BookSchema } from '../schemas/BookSchema.js';

const router = Router();

router.get('/', getBook);
router.get('/:id', getBookById);
router.post('/', validateBody(BookSchema), createBook);
router.put('/:id', validateBody(BookSchema), updateBook);
router.delete('/:id', deleteBook);

export default router;
