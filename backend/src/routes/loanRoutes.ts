import { Router } from 'express';
import {
    createLoan,
    deleteLoan,
    getLoan,
    getLoanById,
    updateLoan,
} from '../controllers/LoanController.js';
import { validateBody } from '../middlewares/validateBody.js';
import { LoanSchema } from '../schemas/LoanSchema.js';

const router = Router();

router.get('/', getLoan);
router.get('/:id', getLoanById);
router.post('/', validateBody(LoanSchema), createLoan);
router.put('/:id', validateBody(LoanSchema), updateLoan);
router.delete('/:id', deleteLoan);

export default router;
