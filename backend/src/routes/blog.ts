import { Router } from 'express';
import { getBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog, addComment } from '../controllers/blog';
import { protect, adminOnly } from '../middlewares/auth';

const router = Router();

router.route('/')
  .get(getBlogs)
  .post(protect, adminOnly, createBlog);

router.get('/:slug', getBlogBySlug);
router.post('/:id/comments', protect, addComment);

router.route('/:id')
  .put(protect, adminOnly, updateBlog)
  .delete(protect, adminOnly, deleteBlog);

export default router;
