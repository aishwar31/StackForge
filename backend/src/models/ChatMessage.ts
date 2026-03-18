import mongoose, { Schema, Document } from 'mongoose';

export interface IChatMessage extends Document {
  sender: string;
  senderId?: string; // Optional user ID for authenticated support
  message: string;
  isFromAdmin: boolean;
  type: 'social' | 'support';
  roomId?: string; // e.g., "support_user123_uuid"
  createdAt: Date;
}

const ChatMessageSchema: Schema = new Schema({
  sender: { type: String, required: true },
  senderId: { type: String },
  message: { type: String, required: true },
  isFromAdmin: { type: Boolean, default: false },
  type: { 
    type: String, 
    enum: ['social', 'support'], 
    default: 'social',
    required: true 
  },
  roomId: { type: String },
}, { timestamps: true });

export default mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema);
