import { Router } from 'express';
import {
	createGenre,
	deleteGenre,
	getGenreById,
	getGenres,
	updateGenre,
} from '../controllers/GenreController.js';
import { validateBody } from '../middlewares/validateBody.js';
import { GenreSchema } from '../schemas/GenreSchema.js';

const router = Router();

router.get('/', getGenres);
router.get('/:id', getGenreById);
router.post('/', validateBody(GenreSchema), createGenre);
router.put('/:id', validateBody(GenreSchema), updateGenre);
router.delete('/:id', deleteGenre);

export default router;
