import Blog from './models/Blog';
import Project from './models/Project';
import User from './models/User';
import bcrypt from 'bcryptjs';
import { createClient } from 'redis';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/stackforge';
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

const projects = [
  {
    title: 'Enterprise Resource Planning System',
    description: 'Designed and implemented a custom ERP solution for Moradabad Development Authority, enabling role-based access, automated approval workflows, real-time auction bid tracking via Socket.io, and ICICI Pay2Corp payment integration.',
    techStack: ['Angular', 'Node.js', 'MariaDB', 'Socket.io', 'ICICI Integration'],
    githubLink: 'https://github.com/aishwar31',
    isFeatured: true,
  },
  {
    title: 'Scrooge - Casino Gaming Platform',
    description: 'Optimized high-traffic RESTful APIs to reduce latency by 40%. Designed and implemented the secure "Vault" system for in-game asset management and built a feature-rich admin panel for monitoring and analytics.',
    techStack: ['React', 'Node.js', 'MongoDB', 'Redis', 'API Optimization'],
    githubLink: 'https://github.com/aishwar31',
    isFeatured: true,
  },
  {
    title: 'Skin Hodlr - Game Skin Trading Platform',
    description: 'Engineered an end-to-end game skin trading platform using the PERN stack. Implemented real-time inventory tracking, secure transaction processing, and a scalable AWS-based infrastructure.',
    techStack: ['PostgreSQL', 'Express', 'React', 'Node.js', 'AWS'],
    githubLink: 'https://github.com/aishwar31',
    isFeatured: true,
  },
  {
    title: 'IAMeetYou - AI-Powered Dating App',
    description: 'AI-powered dating app integrating OpenAI for matchmaking and HumeAI for sentiment analysis. Features scalable RESTful APIs, Stripe monetization, and a responsive React frontend.',
    techStack: ['PostgreSQL', 'Express', 'React', 'Node.js', 'OpenAI', 'HumeAI', 'Stripe'],
    githubLink: 'https://github.com/aishwar31',
    isFeatured: true,
  }
];

const seedDB = async () => {
  const redisClient = createClient({ url: REDIS_URL });

  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB!');

    console.log('Connecting to Redis...');
    await redisClient.connect();
    console.log('Connected to Redis!');

    // Projects
    console.log('Seeding projects...');
    await Project.deleteMany({});
    await Project.insertMany(projects);
    
    // Clear Redis Cache
    await redisClient.del('projects');
    console.log('Redis cache "projects" cleared!');

    // Blogs
    console.log('Seeding blogs...');
    await Blog.deleteMany({});
    await Blog.create({
      title: 'Building Scalable MERN Applications in 2026',
      slug: 'building-scalable-mern-2026',
      content: '# Hello World\n\nThis is my first blog post about modern architecture...',
      summary: 'An exploration of modern full-stack practices using Node, React, and Redis.',
      tags: ['MERN', 'Architecture', 'TypeScript'],
      published: true
    });

    // Admin User
    const adminEmail = 'admin@stackforge.com';
    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        name: 'Aishwary Gupta',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin'
      });
      console.log(`Default admin created: ${adminEmail} / admin123`);
    }

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    await redisClient.disconnect();
    process.exit(0);
  }
};

seedDB();
