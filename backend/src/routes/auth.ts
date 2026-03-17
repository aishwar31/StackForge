import { Router } from 'express';
import { loginAdmin, refreshToken, logout } from '../controllers/auth';
import { protect } from '../middlewares/auth';

const router = Router();

router.post('/login', loginAdmin);
router.post('/refresh-token', refreshToken);
router.post('/logout', protect, logout);

export default router;
