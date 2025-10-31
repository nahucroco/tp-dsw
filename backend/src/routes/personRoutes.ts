import { Router } from 'express';
import {
	createPerson,
	deletePerson,
	getPerson,
	getPersonById,
	updatePerson,
} from '../controllers/PersonController.js';
import { validateBody } from '../middlewares/validateBody.js';
import { validateUniqueEmail } from '../middlewares/validateUniqueEmail.js';
import { PersonSchema } from '../schemas/PersonSchema.js';

const router = Router();
router.get('/', getPerson);
router.get('/:id', getPersonById);
router.put('/:id', validateBody(PersonSchema), validateUniqueEmail, updatePerson);
router.post('/', validateBody(PersonSchema), validateUniqueEmail, createPerson);
router.delete('/:id', deletePerson);
export default router;
