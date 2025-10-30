import { Router } from 'express';
import {
	createSanction,
	deleteSanction,
	getSanction,
	getSanctionById,
	updateSanction,
} from '../controllers/SanctionController.js';
import { validateBody } from '../middlewares/validateBody.js';
import { SanctionSchema } from '../schemas/SanctionSchema.js';

const router = Router();

router.get('/', getSanction);
router.get('/:id', getSanctionById);
router.post('/', validateBody(SanctionSchema), createSanction);
router.put('/:id', validateBody(SanctionSchema), updateSanction);
router.delete('/:id', deleteSanction);

export default router;
