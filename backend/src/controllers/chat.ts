import { Request, Response } from 'express';
import ChatMessage from '../models/ChatMessage';

export const getSupportRooms = async (req: Request, res: Response) => {
  try {
    // Group by roomId and get the latest message for each room
    const rooms = await ChatMessage.aggregate([
      { $match: { type: 'support' } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$roomId',
          lastMessage: { $first: '$message' },
          sender: { $first: '$sender' },
          senderId: { $first: '$senderId' },
          updatedAt: { $first: '$createdAt' },
          unreadCount: {
            $sum: { $cond: [{ $eq: ['$isFromAdmin', false] }, 1, 0] } // Simplistic unread count
          }
        }
      },
      { $sort: { updatedAt: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: rooms
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getRoomHistory = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;
    const history = await ChatMessage.find({ roomId, type: 'support' }).sort({ createdAt: 1 });
    
    res.status(200).json({
      success: true,
      data: history
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
