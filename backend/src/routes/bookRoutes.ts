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
router.post('/', createBook, validateBody(BookSchema));
router.put('/:id', updateBook, validateBody(BookSchema));
router.delete('/:id', deleteBook);

export default router;
