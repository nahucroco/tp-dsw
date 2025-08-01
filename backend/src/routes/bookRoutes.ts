import { Router } from 'express';
import {
  getBook,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} from '../controllers/BookController';

const router = Router();

router.get('/', getBook);
router.get('/:id', getBookById);
router.post('/', createBook);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);

export default router;
