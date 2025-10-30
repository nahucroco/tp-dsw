import { Router } from 'express';
import {
	createLoan,
	deleteLoan,
	getLoan,
	getLoanById,
	updateLoan,
} from '../controllers/LoanController.js';
import { validateBody } from '../middlewares/validateBody.js';
import { validateBookCopiesAvailability } from '../middlewares/validateBookCopiesAvailability.js';
import { LoanSchema } from '../schemas/LoanSchema.js';

const router = Router();

router.get('/', getLoan);
router.get('/:id', getLoanById);
router.post(
	'/',
	validateBody(LoanSchema),
	validateBookCopiesAvailability,
	createLoan,
);
router.put(
	'/:id',
	validateBody(LoanSchema),
	validateBookCopiesAvailability,
	updateLoan,
);
router.delete('/:id', deleteLoan);

export default router;
