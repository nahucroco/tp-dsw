import { Router } from 'express';
import {
	createBook,
	deleteBook,
	getBook,
	getBookById,
	updateBook,
} from '../controllers/BookController.js';

const router = Router();

router.get('/', getBook);
router.get('/:id', getBookById);
router.post('/', createBook);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);

export default router;
