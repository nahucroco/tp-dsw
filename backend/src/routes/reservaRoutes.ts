import { Router } from 'express';
import {
	createReserva,
	deleteReserva,
	getReserva,
	getReservaById,
	updateReserva,
} from '../controllers/ReservaController.js';

const router = Router();

router.get('/', getReserva);
router.get('/:id', getReservaById);
router.post('/', createReserva);
router.put('/:id', updateReserva);
router.delete('/:id', deleteReserva);

export default router;
