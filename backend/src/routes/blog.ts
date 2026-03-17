import { Router } from 'express';
import { getBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog } from '../controllers/blog';
import { protect, adminOnly } from '../middlewares/auth';

const router = Router();

router.route('/')
  .get(getBlogs)
  .post(protect, adminOnly, createBlog);

router.get('/:slug', getBlogBySlug);

router.route('/:id')
  .put(protect, adminOnly, updateBlog)
  .delete(protect, adminOnly, deleteBlog);

export default router;
