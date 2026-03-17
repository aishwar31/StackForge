import { Router } from 'express';
import { submitContact, getMessages, markAsRead } from '../controllers/contact';
import { protect, adminOnly } from '../middlewares/auth';

const router = Router();

router.post('/', submitContact);

router.get('/', protect, adminOnly, getMessages);
router.patch('/:id/read', protect, adminOnly, markAsRead);

export default router;
