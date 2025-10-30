import { Router } from 'express';
import {
	createPublisher,
	deletePublisher,
	getPublisher,
	getPublisherById,
	updatePublisher,
} from '../controllers/PublisherController.js';
import { validateBody } from '../middlewares/validateBody.js';
import { PublisherSchema } from '../schemas/PublisherSchema.js';

const router = Router();

router.get('/', getPublisher);
router.get('/:id', getPublisherById);
router.post('/', validateBody(PublisherSchema), createPublisher);
router.put('/:id', validateBody(PublisherSchema), updatePublisher);
router.delete('/:id', deletePublisher);

export default router;
