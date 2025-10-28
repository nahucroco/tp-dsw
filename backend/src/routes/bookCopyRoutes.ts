import { Router } from 'express';
import {
	createBookCopy,
	deleteBookCopy,
	getBookCopy,
	getBookCopyById,
	updateBookCopy,
} from '../controllers/BookCopyController.js';
import { validateBody } from '../middlewares/validateBody.js';
import { BookCopySchema } from '../schemas/BookCopySchema.js';

const router = Router();

router.get('/', getBookCopy);
router.get('/:id', getBookCopyById);
router.post('/', validateBody(BookCopySchema), createBookCopy);
router.put('/:id', validateBody(BookCopySchema), updateBookCopy);
router.delete('/:id', deleteBookCopy);
export default router;
