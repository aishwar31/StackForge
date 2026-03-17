import { Router, Request, Response } from 'express';
import Analytics from '../models/Analytics';
import { protect, adminOnly } from '../middlewares/auth';
import Project from '../models/Project';
import Blog from '../models/Blog';
import Message from '../models/Message';

const router = Router();

export const getSummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalVisits = await Analytics.countDocuments();
    const totalProjects = await Project.countDocuments();
    const totalBlogs = await Blog.countDocuments();
    const unreadMessages = await Message.countDocuments({ isRead: false });

    // Recent visits
    const recentVisits = await Analytics.find().sort({ visitedAt: -1 }).limit(10);

    res.status(200).json({
      success: true,
      data: {
        totalVisits,
        totalProjects,
        totalBlogs,
        unreadMessages,
        recentVisits,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

router.get('/summary', protect, adminOnly, getSummary);

export default router;
