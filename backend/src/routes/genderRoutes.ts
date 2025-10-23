import { Router } from 'express';
import {
	createGender,
	deleteGender,
	getGenderById,
	getGenders,
	updateGender,
} from '../controllers/GenderController.js';
import { validateBody } from '../middlewares/validateBody.js';
import { GenderSchema } from '../schemas/GenderSchema.js';

const router = Router();

router.get('/', getGenders);
router.get('/:id', getGenderById);
router.post('/', createGender, validateBody(GenderSchema));
router.put('/:id', updateGender, validateBody(GenderSchema));
router.delete('/:id', deleteGender);

export default router;
