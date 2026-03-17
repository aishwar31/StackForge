import { Router } from 'express';
import { getProjects, getProject, createProject, updateProject, deleteProject } from '../controllers/project';
import { protect, adminOnly } from '../middlewares/auth';
import { upload } from '../middlewares/upload';

const router = Router();

router.route('/')
  .get(getProjects)
  .post(protect, adminOnly, upload.array('images', 5), createProject);

router.route('/:id')
  .get(getProject)
  .put(protect, adminOnly, upload.array('images', 5), updateProject)
  .delete(protect, adminOnly, deleteProject);

export default router;
