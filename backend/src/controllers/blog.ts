import { Request, Response } from 'express';
import Blog from '../models/Blog';

export const getBlogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const blogs = await Blog.find({ published: true }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: blogs.length, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getBlogBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug })
      .populate('comments.user', 'name email');
    if (!blog) {
      res.status(404).json({ success: false, message: 'Blog not found' });
      return;
    }
    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const newBlog = await Blog.create(req.body);
    res.status(201).json({ success: true, data: newBlog });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!blog) {
      res.status(404).json({ success: false, message: 'Blog not found' });
      return;
    }
    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      res.status(404).json({ success: false, message: 'Blog not found' });
      return;
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const addComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { text } = req.body;
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      res.status(404).json({ success: false, message: 'Blog not found' });
      return;
    }

    const newComment = {
      user: (req.user as any).id,
      text,
      createdAt: new Date(),
    };

    blog.comments.push(newComment as any);
    await blog.save();

    // Populate the newly added comment's user for immediate UI update
    const updatedBlog = await Blog.findById(blog._id).populate('comments.user', 'name email');
    const comment = updatedBlog?.comments[updatedBlog.comments.length - 1];

    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    console.error('Add Comment Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
