import { Router } from 'express';
import {
	getReserva,
	getReservaById,
	createReserva,
	updateReserva,
	deleteReserva,
} from '../controllers/ReservaController';

const router = Router();

router.get('/', getReserva);
router.get('/:id', getReservaById);
router.post('/', createReserva);
router.put('/:id', updateReserva);
router.delete('/:id', deleteReserva);

export default router;
