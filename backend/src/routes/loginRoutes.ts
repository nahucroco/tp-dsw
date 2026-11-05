import { Router } from 'express';
import { login, me } from '../controllers/AuthController.js';
import { validateBody } from '../middlewares/validateBody.js';
import { LoginSchema } from '../schemas/LoginSchema.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = Router();
router.post('/login', validateBody(LoginSchema), login);
router.get('/me', authenticateToken, me);
export default router;
