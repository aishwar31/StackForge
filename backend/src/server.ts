import app from './app';
import { createClient } from 'redis';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/stackforge';
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

// Redis Client setup
export const redisClient = createClient({ url: REDIS_URL });
redisClient.on('error', (err: Error) => console.log('Redis Client Error', err));

const startServer = async () => {
  try {
    // Database connection
    await mongoose.connect(MONGO_URI);
    console.log(`Connected to MongoDB: ${MONGO_URI}`);

    // Redis connection
    await redisClient.connect();
    console.log('Connected to Redis');

    // Start Express App
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
