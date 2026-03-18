import { Router } from 'express';
import { getSupportRooms, getRoomHistory } from '../controllers/chat';
import { protect, adminOnly } from '../middlewares/auth';

const router = Router();

// Admin only: Get all support threads
router.get('/support-rooms', protect, adminOnly, getSupportRooms);

// Admin or user: Get history for a specific room
router.get('/support-rooms/:roomId/history', protect, getRoomHistory);

export default router;
