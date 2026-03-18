import { Router } from 'express';
import { register, login, refreshToken, logout } from '../controllers/auth';
import { protect } from '../middlewares/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', protect, logout);

export default router;
