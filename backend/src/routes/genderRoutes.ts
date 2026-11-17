import { Router } from 'express';
import {
	createGender,
	deleteGender,
	getGenderById,
	getGenders,
	updateGender,
} from '../controllers/GenreController.js';
import { validateBody } from '../middlewares/validateBody.js';
import { GenreSchema } from '../schemas/GenreSchema.js';

const router = Router();

router.get('/', getGenders);
router.get('/:id', getGenderById);
router.post('/', validateBody(GenreSchema), createGender);
router.put('/:id', validateBody(GenreSchema), updateGender);
router.delete('/:id', deleteGender);

export default router;
