import app from './app';
import { createClient } from 'redis';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import ChatMessage from './models/ChatMessage';
import { generateAIResponse } from './utils/ai';

dotenv.config();

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/stackforge';
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

// Redis Client setup
export const redisClient = createClient({ url: REDIS_URL });
redisClient.on('error', (err: Error) => console.log('Redis Client Error', err));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // --- SOCIAL CHAT (Global) ---
  socket.on('fetch_messages', async () => {
    try {
      const messages = await ChatMessage.find({ type: 'social' }).sort({ createdAt: 1 }).limit(50);
      socket.emit('receive_history', messages);
    } catch (error) {
      console.error('Error fetching social chat history:', error);
    }
  });

  socket.on('send_message', async (data) => {
    try {
      const newMessage = await ChatMessage.create({
        sender: data.sender || 'Anonymous',
        message: data.message,
        isFromAdmin: data.isFromAdmin || false,
        type: 'social'
      });
      io.emit('receive_message', newMessage);
    } catch (error) {
      console.error('Error saving social chat message:', error);
    }
  });

  // --- SUPPORT CHAT (Room-based) ---
  socket.on('join_support', async ({ roomId, userId }) => {
    socket.join(roomId);
    console.log(`User ${userId} joined support room: ${roomId}`);
    
    try {
      const history = await ChatMessage.find({ roomId, type: 'support' }).sort({ createdAt: 1 });
      socket.emit('receive_support_history', history);
    } catch (error) {
      console.error('Error fetching support history:', error);
    }
  });

  socket.on('send_support_message', async (data) => {
    try {
      const { roomId, sender, senderId, message, isFromAdmin } = data;
      const newMessage = await ChatMessage.create({
        sender,
        senderId,
        message,
        isFromAdmin: isFromAdmin || false,
        type: 'support',
        roomId
      });
      
      io.to(roomId).emit('receive_support_message', newMessage);
      
      if (!isFromAdmin) {
        io.emit('new_support_request', { roomId, sender });

        // --- AI SUPPORT LOGIC ---
        // 1. Check if a HUMAN admin has recently (last 5 mins) replied in this room
        // We exclude "Architect Assistant" from this check so the AI can have a conversation 
        // if the client keep asking questions.
        const lastHumanAdminMessage = await ChatMessage.findOne({ 
          roomId, 
          isFromAdmin: true,
          sender: { $ne: "Architect Assistant" },
          type: 'support',
          createdAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) }
        });

        if (!lastHumanAdminMessage) {
          console.log(`[AI] Triggering for ${roomId} - No recent human admin detected.`);
          
          // Fetch last 10 messages for context
          const context = await ChatMessage.find({ roomId, type: 'support' })
            .sort({ createdAt: -1 })
            .limit(10);
          
          const chatHistory = context.reverse()
            .filter(m => m.message !== message) // Don't include the current message in history twice
            .map(m => ({
              role: m.sender === "Architect Assistant" || m.isFromAdmin ? 'admin' : 'user',
              text: m.message
            }));

          const aiText = await generateAIResponse(message, chatHistory);

          if (aiText) {
            const aiMessage = await ChatMessage.create({
              sender: "Architect Assistant",
              message: aiText,
              isFromAdmin: true, 
              type: 'support',
              roomId
            });

            io.to(roomId).emit('receive_support_message', aiMessage);
          }
        } else {
          console.log(`[AI] Bypassed for ${roomId} - Human admin recently active.`);
        }
      }
    } catch (error) {
      console.error('Error saving support message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(`Connected to MongoDB: ${MONGO_URI}`);
    try {
      await redisClient.connect();
      console.log('Connected to Redis');
    } catch (redisError) {
      console.warn('Redis connection failed. Continuing without caching features.', redisError);
    }
    httpServer.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
