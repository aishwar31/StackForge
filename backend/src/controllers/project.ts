import { Request, Response } from 'express';

import Project from '../models/Project';
import { redisClient } from '../server';

export const getProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check Redis cache first
    const cachedProjects = await redisClient.get('projects');
    if (cachedProjects) {
      const data = JSON.parse(cachedProjects);
      if (data.length > 0) {
        res.status(200).json({ success: true, data });
        return;
      }
    }

    const projects = await Project.find().sort({ createdAt: -1 });

    // Only cache if there are projects to show
    if (projects.length > 0) {
      await redisClient.setEx('projects', 3600, JSON.stringify(projects));
    }

    res.status(200).json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    console.error('getProjects Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }
    res.status(200).json({ success: true, data: project });
  } catch (error) {
    console.error('getProject Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    // Image paths from Multer files
    let images: string[] = [];
    if (req.files) {
      const files = req.files as Express.Multer.File[];
      images = files.map((file) => `/uploads/${file.filename}`);
    }

    const newProject = await Project.create({ ...req.body, images });

    // Clear Redis Cache
    await redisClient.del('projects');

    res.status(201).json({ success: true, data: newProject });
  } catch (error) {
    console.error('createProject Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateProject = async (req: Request, res: Response): Promise<void> => {
  try {
    let project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }

    let images = project.images;
    if (req.files && (req.files as any[]).length > 0) {
      const files = req.files as Express.Multer.File[];
      const newImages = files.map((file) => `/uploads/${file.filename}`);
      images = [...images, ...newImages];
    }

    project = await Project.findByIdAndUpdate(
      req.params.id,
      { ...req.body, images },
      { new: true, runValidators: true }
    );

    // Clear Redis Cache
    await redisClient.del('projects');

    res.status(200).json({ success: true, data: project });
  } catch (error) {
    console.error('updateProject Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }

    await project.deleteOne();
    
    // Clear Redis Cache
    await redisClient.del('projects');

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.error('deleteProject Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
